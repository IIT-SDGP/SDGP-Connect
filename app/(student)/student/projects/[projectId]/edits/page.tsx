'use client'

import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { ProjectApprovalStatus } from '@prisma/client'
import type { ProjectSubmissionSchema } from '@/validations/submit_project'
import ProjectEditForm from '@/components/submit-form/ProjectEditForm'

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
}

export default function StudentEditProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { projectId } = params

  const [data, setData] = useState<StudentProjectDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const response = await axios.get<StudentProjectDetailResponse>(`/api/student/projects/${projectId}`)
        setData(response.data)
      } catch (e: any) {
        setErrorMessage(e?.response?.data?.error || e.message || 'Failed to load edit draft')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [projectId])

  const initialSnapshot = useMemo(() => {
    if (!data) return null
    return (data.pendingEdit?.draftSnapshot ?? data.live) as ProjectSubmissionSchema
  }, [data])

  if (isLoading) {
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

  const isApproved = data.approvalStatus === ProjectApprovalStatus.APPROVED
  if (!isApproved) {
    return (
      <Alert>
        <AlertTitle>Edit locked</AlertTitle>
        <AlertDescription>
          Your project is currently <strong>{data.approvalStatus}</strong>. You can submit edits only after an admin approves the project.
        </AlertDescription>
        <div className='mt-4'>
          <Button variant='outline' onClick={() => router.push('/student/projects')}>
            Back to projects
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <ProjectEditForm projectId={projectId} initialSnapshot={initialSnapshot} />
  )
}

