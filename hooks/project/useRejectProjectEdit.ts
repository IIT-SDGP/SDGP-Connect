import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

export function useRejectProjectEdit(options?: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const rejectEdit = async (editId: string, reason: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/admin/project-edits/reject', {
        editId,
        reason,
      })

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to reject edit')
      }

      toast.success('Edit rejected', {
        description: 'Live project unchanged.',
      })
      options?.onSuccess?.()
      return response.data
    } catch (err: any) {
      const status = err?.response?.status
      const data = err?.response?.data
      const msg = data?.error || data?.details || err?.message || `Failed to reject edit${status ? ` (${status})` : ''}`
      setError(new Error(msg))
      toast.error('Reject failed', { description: msg })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { rejectEdit, isLoading, error }
}

export default useRejectProjectEdit