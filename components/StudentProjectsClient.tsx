// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client'

import axios from 'axios'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectApprovalStatus } from '@prisma/client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type StudentProjectRow = {
    projectId: string
    title: string
    groupNum: string
    year: string
    approvalStatus: string | null
    rejectedReason: string | null
    pendingEdit: boolean
    lookingForInvestment: boolean | null
}

export default function StudentProjectsClient() {
    const router = useRouter()

    const [projects, setProjects] = useState<StudentProjectRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            setErrorMessage(null)
            try {
                const response = await axios.get<{ data: StudentProjectRow[] }>(
                    '/api/student/projects',
                    { params: { page: 1, limit: 50 } }
                )
                setProjects(response.data.data ?? [])
            } catch (e: any) {
                setErrorMessage(e?.response?.data?.error || e.message || 'Failed to load projects')
                setProjects([])
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const handleInvestmentToggle = async (projectId: string, checked: boolean) => {
        setUpdatingProjectId(projectId)
        setErrorMessage(null)

        const previousProjects = projects

        setProjects((current) =>
            current.map((project) =>
                project.projectId === projectId
                    ? { ...project, lookingForInvestment: checked }
                    : project
            )
        )

        try {
            await axios.patch(`/api/student/projects/${projectId}`, {
                lookingForInvestment: checked,
            })
        } catch (e: any) {
            setProjects(previousProjects)
            setErrorMessage(e?.response?.data?.error || e.message || 'Failed to update investment status')
        } finally {
            setUpdatingProjectId(null)
        }
    }

    if (isLoading) {
        return (
            <div className='space-y-3'>
                <Skeleton className='h-8 w-64' />
                <Skeleton className='h-10 w-full' />
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

    if (projects.length === 0) {
        return (
            <Alert>
                <AlertTitle>No projects found</AlertTitle>
                <AlertDescription>You have no projects yet.</AlertDescription>
            </Alert>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Pending Edit</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((p) => (
                    <Fragment key={p.projectId}>
                        <TableRow>
                            <TableCell className='font-medium'>{p.title}</TableCell>
                            <TableCell>{p.groupNum}</TableCell>
                            <TableCell>{p.year}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        p.approvalStatus === ProjectApprovalStatus.APPROVED
                                            ? 'default'
                                            : p.approvalStatus === ProjectApprovalStatus.REJECTED
                                                ? 'destructive'
                                                : 'secondary'
                                    }
                                >
                                    {p.approvalStatus ?? 'UNKNOWN'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Switch
                                        checked={p.lookingForInvestment ?? false}
                                        disabled={updatingProjectId === p.projectId}
                                        onCheckedChange={(checked) =>
                                            handleInvestmentToggle(p.projectId, checked)
                                        }
                                    />
                                    <span className='text-sm text-muted-foreground'>
                                        {p.lookingForInvestment ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {p.pendingEdit ? (
                                    <Badge variant='outline'>PENDING</Badge>
                                ) : (
                                    <span className='text-muted-foreground'>—</span>
                                )}
                            </TableCell>
                            <TableCell className='text-right'>
                                <div className='flex justify-end gap-2'>
                                    <Button size='sm' variant='outline' asChild>
                                        <Link href={`/project/${p.projectId}`}>View</Link>
                                    </Button>
                                    <Button
                                        size='sm'
                                        onClick={() =>
                                            router.push(`/dashboard/projects/${p.projectId}/edits`)
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        {p.approvalStatus === ProjectApprovalStatus.REJECTED && p.rejectedReason ? (
                            <TableRow key={`${p.projectId}-reason`}>
                                <TableCell colSpan={7} className='bg-destructive/5 text-sm'>
                                    <span className='font-medium text-destructive'>Rejected reason:</span>{' '}
                                    <span className='text-muted-foreground'>{p.rejectedReason}</span>
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    )
}
