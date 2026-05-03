// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { ADMIN_READ_ROLES, requireRole, STUDENT_ROLES } from '@/lib/auth/permissions';

// ✅ Allow only these MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf"
];

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole([...STUDENT_ROLES, ...ADMIN_READ_ROLES]);
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length > MAX_SIZE_BYTES) {
      return NextResponse.json({ message: "File too large" }, { status: 413 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "File type not allowed" }, { status: 400 });
    }

    const tempFilePath = join(os.tmpdir(), `upload-${uuidv4()}`);
    await writeFile(tempFilePath, buffer);

    const container = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const sas = process.env.AZURE_STORAGE_SAS_TOKEN;

    if (!container || (!connectionString && (!account || (!accountKey && !sas)))) {
      fs.unlinkSync(tempFilePath);
      return NextResponse.json({ message: "Missing Azure config" }, { status: 500 });
    }

    const blobServiceClient = connectionString
      ? BlobServiceClient.fromConnectionString(connectionString)
      : accountKey
        ? BlobServiceClient.fromConnectionString(
          `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
        )
        : new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
    const containerClient = blobServiceClient.getContainerClient(container);
    const uniqueName = `${uuidv4()}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

    await blockBlobClient.uploadFile(tempFilePath, {
      blobHTTPHeaders: {
        blobContentType: file.type,
        blobContentDisposition: 'attachment',
      },
    });

    fs.unlinkSync(tempFilePath);

    const publicAccount = account ?? BlobServiceClient.fromConnectionString(connectionString!).accountName;
    const publicUrl = `https://${publicAccount}.blob.core.windows.net/${container}/${uniqueName}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
