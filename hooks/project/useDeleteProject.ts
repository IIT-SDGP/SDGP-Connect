import { useState } from 'react';

interface UseDeleteProjectOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteProject(options: UseDeleteProjectOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteProject = async (projectId: number | string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      options.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete project');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteProject,
    loading,
    error,
  };
}
