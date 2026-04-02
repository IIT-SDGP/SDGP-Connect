// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/prisma/prismaClient'
import { Role } from '@/types/prisma-types'
import StudentEditProjectClient from '@/components/StudentEditProjectClient'

export const metadata: Metadata = {
  title: 'Edit Project',
}

export default async function StudentEditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  const session = await getServerSession(authOptions)

  // Must be authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Must be a STUDENT (admins have their own routes)
  if (session.user.role !== Role.STUDENT) {
    redirect('/unauthorized')
  }

  // Verify this student is the owner of this project
  const project = await prisma.projectMetadata.findFirst({
    where: {
      project_id: projectId,
      owner_userId: session.user.id,
    },
    select: { project_id: true },
  })

  if (!project) {
    // Student is authenticated but does NOT own this project
    redirect('/unauthorized')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Edit Project</h1>
        <p className='text-muted-foreground'>Review and submit changes to your approved project.</p>
      </div>

      <StudentEditProjectClient projectId={projectId} />
    </div>
  )
}