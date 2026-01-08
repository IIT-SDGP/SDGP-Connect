// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function GET() {
  return new Promise((resolve) => {
    exec('npx prisma generate', (err, stdout, stderr) => {
      if (err) {
        return resolve(NextResponse.json({ error: stderr }, { status: 500 }));
      }
      resolve(NextResponse.json({ message: stdout }));
    });
  });
}
