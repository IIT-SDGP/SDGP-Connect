// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Role } from '@/types/prisma-types'
import StudentProjectsClient from '@/components/StudentProjectsClient'

export const metadata: Metadata = {
  title: 'My Projects | Student',
}

export default async function StudentProjectsPage() {
  const session = await getServerSession(authOptions)

  // Must be authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Must be a STUDENT
  if (session.user.role !== Role.STUDENT) {
    redirect('/unauthorized')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>My Projects</h1>
        <p className='text-muted-foreground'>
          Submit edits for projects that are approved by an admin.
        </p>
      </div>

      <StudentProjectsClient />
    </div>
  )
}