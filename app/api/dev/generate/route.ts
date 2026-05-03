// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
