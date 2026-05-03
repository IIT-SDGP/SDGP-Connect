import { useState } from 'react';
import { toast } from 'sonner';

interface AddUserData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MODERATOR' | 'DEVELOPER';
}

export const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (userData: AddUserData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data = await response.json();
      toast.success('User created successfully');
      setError(null);
      return data.user;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error };
};
