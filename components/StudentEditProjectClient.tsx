// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ProjectApprovalStatus } from '@prisma/client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProjectEditForm from '@/components/submit-form/ProjectEditForm'
import type { ProjectSubmissionSchema } from '@/validations/submit_project'
import { Role } from '@/types/prisma-types'

type StudentProjectDetailResponse = {
    live: any
    pendingEdit: null | {
        id: string
        status: string
        baseContentId: string | null
        draftSnapshot: any
        changes: any
    }
    approvalStatus: string
    // API should return the owner/member IDs so the client can verify
    memberIds: string[]
}

type Props = {
    projectId: string
}

export default function StudentEditProjectClient({ projectId }: Props) {
    const router = useRouter()
    const { data: session, status: sessionStatus } = useSession()

    const [data, setData] = useState<StudentProjectDetailResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const sessionUserId = session?.user?.id
    const sessionUserRole = session?.user?.role

    useEffect(() => {
        if (sessionStatus === 'loading') return

        if (!session?.user) {
            router.replace('/login')
            return
        }

        if (sessionUserRole !== Role.STUDENT) {
            router.replace('/unauthorized')
        }
    }, [sessionStatus, session, sessionUserRole, router])

    useEffect(() => {
        if (sessionStatus !== 'authenticated' || sessionUserRole !== Role.STUDENT) return

        const load = async () => {
            setIsLoading(true)
            setErrorMessage(null)
            try {
                const response = await axios.get<StudentProjectDetailResponse>(
                    `/api/student/projects/${projectId}`
                )
                setData(response.data)
            } catch (e: any) {
                setErrorMessage(e?.response?.data?.error || e.message || 'Failed to load edit draft')
                setData(null)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [projectId, sessionStatus, sessionUserRole])

    const isOwner = useMemo(() => {
        if (!data || !sessionUserId) return false
        if (sessionUserRole === Role.ADMIN) return true
        return data.memberIds?.includes(sessionUserId) ?? false
    }, [data, sessionUserId, sessionUserRole])

    const initialSnapshot = useMemo(() => {
        if (!data) return null
        return (data.pendingEdit?.draftSnapshot ?? data.live) as ProjectSubmissionSchema
    }, [data])

    if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && isLoading)) {
        return (
            <div className='space-y-4'>
                <Skeleton className='h-8 w-64' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </div>
        )
    }

    if (errorMessage) {
        return (
            <Alert variant='destructive'>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
        )
    }

    if (!data || !initialSnapshot) {
        return (
            <Alert variant='destructive'>
                <AlertTitle>Not found</AlertTitle>
                <AlertDescription>Could not load project details.</AlertDescription>
            </Alert>
        )
    }

    if (!isOwner) {
        return (
            <Alert variant='destructive'>
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You do not have permission to edit this project.</AlertDescription>
            </Alert>
        )
    }

    if (data.approvalStatus !== ProjectApprovalStatus.APPROVED) {
        return (
            <Alert>
                <AlertTitle>Edit locked</AlertTitle>
                <AlertDescription>
                    Your project is currently <strong>{data.approvalStatus}</strong>. You can submit edits
                    only after an admin approves the project.
                </AlertDescription>
                <div className='mt-4'>
                    <Button variant='outline' onClick={() => router.push('/student/projects')}>
                        Back to projects
                    </Button>
                </div>
            </Alert>
        )
    }

    return <ProjectEditForm projectId={projectId} initialSnapshot={initialSnapshot} />
}