import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

export function useApproveProjectEdit(options?: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [conflictInfo, setConflictInfo] = useState<any>(null)

  const approveEdit = async (editId: string) => {
    setIsLoading(true)
    setError(null)
    setConflictInfo(null)

    try {
      const response = await axios.post('/api/admin/project-edits/approve', { editId })
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to approve edit')
      }

      toast.success('Edit approved', {
        description: 'Your changes have been applied to the live project.',
      })
      options?.onSuccess?.()
      return response.data
    } catch (err: any) {
      const status = err?.response?.status
      const data = err?.response?.data

      if (status === 409 && data?.code === 'EDIT_CONFLICT') {
        setConflictInfo(data)
        setError(new Error(data?.error || 'Edit conflict'))
        toast.error('Edit conflict', {
          description: data?.error || 'The live project changed since the edit draft was created.',
        })
        return null
      }

      const msg = data?.error || data?.details || err?.message || 'Failed to approve edit'
      setError(new Error(msg))
      toast.error('Approve failed', { description: msg })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { approveEdit, isLoading, error, conflictInfo }
}

export default useApproveProjectEdit