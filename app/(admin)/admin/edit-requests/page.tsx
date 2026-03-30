'use client'

import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectEditStatus } from '@prisma/client'
import ProjectEditReviewDialog from '@/components/dialogs/ProjectEditReviewDialog'

type AdminEditRow = {
  editId: string
  projectId: string
  projectTitle: string
  groupNum: string
  year: string
  student: { id: string; name: string }
  status: ProjectEditStatus
  createdAt: any
  updatedAt: any
  changesCount: number
}

export default function AdminEditRequestsPage() {
  const [tab, setTab] = useState<ProjectEditStatus>(ProjectEditStatus.PENDING)
  const [search, setSearch] = useState('')

  const [edits, setEdits] = useState<AdminEditRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null)

  const fetchEdits = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await axios.get<{
        data: AdminEditRow[]
      }>('/api/admin/project-edits', {
        params: {
          status: tab,
          page: 1,
          limit: 50,
          search: search.trim() ? search.trim() : undefined,
        },
      })
      setEdits(res.data.data ?? [])
    } catch (e: any) {
      setErrorMessage(e?.response?.data?.error || e.message || 'Failed to load edit requests')
      setEdits([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEdits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    const t = setTimeout(() => {
      fetchEdits()
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const titleForTab = useMemo(() => {
    if (tab === ProjectEditStatus.PENDING) return 'Pending'
    if (tab === ProjectEditStatus.APPROVED) return 'Approved'
    return 'Rejected'
  }, [tab])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Edit Requests</h1>
        <p className='text-muted-foreground'>Students submit proposed changes; admins approve or reject with diffs.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as ProjectEditStatus)}>
        <TabsList>
          <TabsTrigger value={ProjectEditStatus.PENDING}>Pending</TabsTrigger>
          <TabsTrigger value={ProjectEditStatus.APPROVED}>Approved</TabsTrigger>
          <TabsTrigger value={ProjectEditStatus.REJECTED}>Rejected</TabsTrigger>
        </TabsList>

        <div className='my-4 flex items-center gap-4'>
          <Input
            placeholder='Search by project title...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-md'
          />
          <Button variant='outline' onClick={() => fetchEdits()}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : errorMessage ? (
          <Alert variant='destructive'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : edits.length === 0 ? (
          <Alert>
            <AlertTitle>No edits</AlertTitle>
            <AlertDescription>No {titleForTab.toLowerCase()} edit requests found.</AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {edits.map((e) => (
                <TableRow key={e.editId}>
                  <TableCell className='font-medium'>
                    {e.projectTitle}
                    <div className='text-xs text-muted-foreground'>
                      {e.groupNum} | {e.year}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{e.student?.name || e.student?.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={e.status === ProjectEditStatus.PENDING ? 'outline' : 'secondary'}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{e.changesCount}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setSelectedEditId(e.editId)
                        setDialogOpen(true)
                      }}
                    >
                      Review Diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Tabs>

      <ProjectEditReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editId={selectedEditId}
        onResolved={() => fetchEdits()}
      />
    </div>
  )
}