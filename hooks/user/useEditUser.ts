import { useState } from 'react';
import { toast } from 'sonner';

interface EditUserData {
  id: string;
  name?: string;
  password?: string;
  role?: 'ADMIN' | 'MODERATOR' | 'DEVELOPER' | 'STUDENT';
}

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = async (userData: EditUserData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      toast.success('User updated successfully');
      setError(null);
      return data.user;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editUser, loading, error };
};
