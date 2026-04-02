// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import EditRequestsClient from '@/components/EditRequestsClient'

export const metadata: Metadata = {
  title: 'Edit Requests | Admin',
}

export default function AdminEditRequestsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Edit Requests</h1>
        <p className='text-muted-foreground'>
          Students submit proposed changes; admins approve or reject with diffs.
        </p>
      </div>

      <EditRequestsClient />
    </div>
  )
}