// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import ProjectDetails from '@/components/ProjectDetails'
import React from 'react'

interface Props {
    params: Promise<{
        projectId: string
    }>
}

const ProjectPage = async ({ params }: Props) => {
    const { projectId } = await params;
    
    return (
        <div>
           <ProjectDetails projectID={projectId} />
        </div>
    )
}

export default ProjectPage
