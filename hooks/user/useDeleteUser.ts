import { useState } from 'react';
import { toast } from 'sonner';

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      toast.success('User deleted successfully');
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};
