// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Role } from '@/types/prisma-types'
import EditRequestsClient from '@/components/EditRequestsClient'

export const metadata: Metadata = {
  title: 'Edit Requests | Admin',
}

export default async function AdminEditRequestsPage() {
  const session = await getServerSession(authOptions)

  // Must be authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Must be an ADMIN
  if (session.user.role !== Role.ADMIN) {
    redirect('/unauthorized')
  }

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