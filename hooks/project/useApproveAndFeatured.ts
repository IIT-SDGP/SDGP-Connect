import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface UseApproveAndFeaturedOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onAlreadyApproved?: (data: any) => void;
}

export function useApproveAndFeatured(options?: UseApproveAndFeaturedOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approveProject = async (
    projectId: string,
    featured: boolean = false
  ) => {
  
    setIsLoading(true);
    setError(null);

    try {
    const response = await axios.post('/api/admin/projects/approve', {
        projectId: String(projectId),
        featured,
      });

      
      setIsLoading(false);
      
      if (response.status === 200) {
        toast.success('Project approved successfully', {
          description: featured ? 'Project has been approved and featured' : 'Project has been approved',
        });
        
        // Call the onSuccess callback if provided
        if (options?.onSuccess) {
          options.onSuccess();
        }
        
        return true;
      } else {
        console.error('Non-200 response:', response);
        throw new Error(`Failed to approve project: Status ${response.status}`);
      }
    } catch (err: any) {
      console.error('Error in approveProject:', err);
      setIsLoading(false);
      
      // Log the full error details
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        stack: err.stack
      });
      
      // Handle conflict case (project already approved)
      if (err.response?.status === 409) {
        const conflictData = err.response.data;
        const errorMessage = conflictData.error || 'This project has already been approved';
        
        setError(new Error(errorMessage));
        
        toast.error('Approval Conflict', {
          description: errorMessage,
        });
        
        // Call the onAlreadyApproved callback if provided
        if (options?.onAlreadyApproved) {
          options.onAlreadyApproved(conflictData);
        }
        
        // Call the onSuccess callback to refresh the list anyway
        if (options?.onSuccess) {
          options.onSuccess();
        }
        
        return false;
      }
      
      // Enhanced error details for 500 errors
      if (err.response?.status === 500) {
        console.error('Server error details:', err.response.data);
      }
      
      // Handle other errors
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to approve project';
      console.error('Final error message:', errorMessage);
      setError(new Error(errorMessage));
      
      toast.error('Error approving project', {
        description: errorMessage,
      });
      
      // Call the onError callback if provided
      if (options?.onError) {
        options.onError(new Error(errorMessage));
      }
      
      return false;
    }
  };

  return {
    approveProject,
    isLoading,
    error
  };
}
