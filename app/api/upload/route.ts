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
    // ✅ Upload key validation
    const clientKey = request.headers.get("x-upload-key");
    const expectedKey = process.env.NEXT_PUBLIC_UPLOAD_API_KEY;

    if (!clientKey || clientKey !== expectedKey) {
      return NextResponse.json({ message: "Unauthorized upload" }, { status: 401 });
    }

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

    const account = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME;
    const container = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;
    const sas = process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN;

    if (!account || !container || !sas) {
      fs.unlinkSync(tempFilePath);
      return NextResponse.json({ message: "Missing Azure config" }, { status: 500 });
    }

    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
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

    const publicUrl = `https://${account}.blob.core.windows.net/${container}/${uniqueName}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
