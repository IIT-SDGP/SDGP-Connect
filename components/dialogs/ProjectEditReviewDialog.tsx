'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useApproveProjectEdit } from '@/hooks/project/useApproveProjectEdit'
import { useRejectProjectEdit } from '@/hooks/project/useRejectProjectEdit'
import type { ProjectEditStatus, ProjectApprovalStatus } from '@prisma/client'
import { ProjectEditStatus as EditStatusEnum } from '@prisma/client'
import { toast } from 'sonner'

type AdminProjectEditDetail = {
  edit: {
    id: string
    projectId: string
    status: ProjectEditStatus | string
    baseContentId: string | null
    rejectedReason: string | null
    reviewedAt: Date | string | null
    draftSnapshot: any
    changes: any
  }
  live: any
}

export default function ProjectEditReviewDialog({
  open,
  onOpenChange,
  editId,
  onResolved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editId: string | null
  onResolved: () => void
}) {
  const [detail, setDetail] = useState<AdminProjectEditDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState('')

  const { approveEdit, isLoading: isApproving, conflictInfo } = useApproveProjectEdit({
    onSuccess: () => {
      onResolved()
      onOpenChange(false)
    },
  })

  const { rejectEdit, isLoading: isRejecting } = useRejectProjectEdit({
    onSuccess: () => {
      onResolved()
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (!open || !editId) return
    setIsLoading(true)
    setDetail(null)
    setReason('')

    axios
      .get<AdminProjectEditDetail>(`/api/admin/project-edits/${editId}`)
      .then((res) => setDetail(res.data))
      .catch((e) => {
        const msg = e?.response?.data?.error || e.message || 'Failed to load edit detail'
        toast.error('Failed to load edit', { description: msg })
      })
      .finally(() => setIsLoading(false))
  }, [open, editId])

  const changes = useMemo(() => {
    if (!detail?.edit?.changes) return []
    return Array.isArray(detail.edit.changes) ? detail.edit.changes : []
  }, [detail])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!w-auto !max-w-none md:min-w-[900px] md:max-w-[95vw]'>
        <DialogHeader>
          <DialogTitle>Review Edit Request</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='py-10'>
            <LoadingSpinner size='lg' />
          </div>
        ) : !detail ? (
          <Alert variant='destructive'>
            <AlertTitle>Not found</AlertTitle>
            <AlertDescription>Could not load edit request details.</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className='flex items-center gap-3'>
              <Badge variant='secondary'>Status: {detail.edit.status}</Badge>
              {detail.edit.baseContentId ? (
                <span className='text-xs text-muted-foreground'>Base: {detail.edit.baseContentId}</span>
              ) : null}
            </div>

            {conflictInfo ? (
              <Alert variant='destructive' className='mt-4'>
                <AlertTitle>Conflict</AlertTitle>
                <AlertDescription>
                  {conflictInfo.error} (Base: {conflictInfo.baseContentId}, Live: {conflictInfo.liveContentId})
                </AlertDescription>
              </Alert>
            ) : null}

            {detail.edit.rejectedReason ? (
              <Alert variant='default' className='mt-4'>
                <AlertTitle>Rejected Reason</AlertTitle>
                <AlertDescription>{detail.edit.rejectedReason}</AlertDescription>
              </Alert>
            ) : null}

            <ScrollArea className='h-[55vh] mt-4'>
              <div className='space-y-4'>
                {changes.length === 0 ? (
                  <Alert>
                    <AlertTitle>No changes detected</AlertTitle>
                    <AlertDescription>This edit request contains no diffs.</AlertDescription>
                  </Alert>
                ) : (
                  changes.map((c: any, idx: number) => (
                    <div
                      key={idx}
                      className='rounded-lg border bg-muted/30 p-3 space-y-2'
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <div className='text-sm font-medium'>Path</div>
                        <Badge variant='outline' className='break-all'>
                          {String(c.path)}
                        </Badge>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <div className='text-xs text-muted-foreground'>From</div>
                          <pre className='text-xs bg-background rounded-md p-2 overflow-auto'>
                            {typeof c.from === 'string' ? c.from : JSON.stringify(c.from, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className='text-xs text-muted-foreground'>To</div>
                          <pre className='text-xs bg-background rounded-md p-2 overflow-auto'>
                            {typeof c.to === 'string' ? c.to : JSON.stringify(c.to, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <DialogFooter className='mt-4'>
              {detail.edit.status === EditStatusEnum.PENDING ? (
                <>
                  <div className='w-full space-y-2'>
                    <Textarea
                      placeholder='Rejection reason (required when rejecting)'
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className='min-h-[90px]'
                      maxLength={500}
                    />
                  </div>

                  <div className='flex w-full justify-end gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => onOpenChange(false)}
                      disabled={isApproving || isRejecting}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!editId) return
                        await approveEdit(editId)
                      }}
                      disabled={!editId || isApproving || isRejecting}
                    >
                      {isApproving ? <LoadingSpinner /> : 'Approve'}
                    </Button>
                    <Button
                      variant='destructive'
                      disabled={!editId || !reason.trim() || isApproving || isRejecting}
                      onClick={async () => {
                        if (!editId) return
                        await rejectEdit(editId, reason.trim())
                      }}
                    >
                      {isRejecting ? <LoadingSpinner /> : 'Reject'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className='w-full flex justify-end'>
                  <Button variant='outline' onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}