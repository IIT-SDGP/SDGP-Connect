// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import StudentEditProjectClient from '@/components/StudentEditProjectClient'

export const metadata: Metadata = {
  title: 'Edit Project',
}

export default function StudentEditProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Edit Project</h1>
        <p className='text-muted-foreground'>Review and submit changes to your approved project.</p>
      </div>

      <StudentEditProjectClient projectId={params.projectId} />
    </div>
  )
}