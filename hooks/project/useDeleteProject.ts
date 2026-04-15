import { useState } from 'react';
import axios from 'axios';

interface UseDeleteProjectOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useDeleteProject(options: UseDeleteProjectOptions = {}) {
  const { onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteProject = async (projectId: string | number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.delete(`/api/admin/projects/${projectId}/delete`);
      setSuccess(true);
      onSuccess && onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete project';
      setError(errorMessage);
      onError && onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    deleteProject,
    loading,
    error,
    success,
    clearState,
  };
}
