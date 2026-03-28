import { useState } from 'react';
import axios from 'axios';
import { ProjectSubmissionSchema } from '@/validations/submit_project';
import useUploadImageToBlob from '../azure/useUploadImageToBlob';
import { SubmitProjectResponse } from '@/types/project/response';
import { getModuleFromYear } from '@/lib/utils/module';

export const useSubmitProject = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { uploadImage, isLoading: isUploadingImages } = useUploadImageToBlob();
  // const BASE_URL = process.env.BASE_URL || 'https://sdgp-connect.vercel.app';
  // Helper to sanitize the submission data to ensure it's JSON serializable
  const sanitizeSubmissionData = (data: any): any => {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    // Handle File objects
    if (data instanceof File) {
      return null; // Files should already be uploaded and URLs stored instead
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => sanitizeSubmissionData(item));
    }

    // Handle objects
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeSubmissionData(value);
    }

    return result;
  };

  /**
   * Helper function to validate an image file
   */
  const validateImage = (image: File): { valid: boolean; message?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(image.type)) {
      return {
        valid: false,
        message: `Unsupported file type: ${image.type}. Please use JPEG, PNG, GIF, WebP, or SVG.`
      };
    }

    // Check file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return {
        valid: false,
        message: `File too large (${(image.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`
      };
    }

    return { valid: true };
  };

  /**
   * Helper function to handle a single image upload
   */
  const handleImageUpload = async (
    image: File | string | null | undefined,
    identifier: string
  ): Promise<string | null> => {
    if (!image) {
      return null;
    }

    if (typeof image === 'string') {
      return image; // Already a URL
    }

    if (!(image instanceof File)) {
      return null;
    }

  

    // Validate the image
    const validation = validateImage(image);
    if (!validation.valid) {
      setUploadProgress(prev => ({ ...prev, [identifier]: -1 })); // -1 indicates error
      throw new Error(validation.message || 'Invalid image file');
    }

    try {
      setUploadProgress(prev => ({ ...prev, [identifier]: 0 }));

      // Use the progress callback
      const imageUrl = await uploadImage(image, (progress) => {
        setUploadProgress(prev => ({ ...prev, [identifier]: progress }));
      });

      setUploadProgress(prev => ({ ...prev, [identifier]: 100 }));
      return imageUrl;
    } catch (err) {
      console.error(`Error uploading image (${identifier}):`, err);
      setUploadProgress(prev => ({ ...prev, [identifier]: -1 })); // -1 indicates error
      throw err;
    }
  };


  /**
   * Update a path in submission data based on the identifier
   */
  const updateSubmissionPath = (
    data: any,
    identifier: string,
    value: any
  ): any => {
    // Clone the data first
    const updatedData = { ...data };

    // Handle different identifier patterns
    if (identifier === 'cover_image') {
      if (!updatedData.metadata) updatedData.metadata = {};
      updatedData.metadata.cover_image = value;
    }
    else if (identifier === 'logo') {
      if (!updatedData.metadata) updatedData.metadata = {};
      updatedData.metadata.logo = value;
    }
    else if (identifier.startsWith('team_member_')) {
      const index = parseInt(identifier.replace('team_member_', ''));
      if (!updatedData.team) updatedData.team = [];
      if (!updatedData.team[index]) updatedData.team[index] = {};
      updatedData.team[index].profile_image = value;
    }
    else if (identifier.startsWith('slide_')) {
      const index = parseInt(identifier.replace('slide_', ''));
      if (!updatedData.slides) updatedData.slides = [];
      if (!updatedData.slides[index]) updatedData.slides[index] = {};
      updatedData.slides[index].slides_content = value;
    }

    return updatedData;
  };

  const submitProject = async (data: ProjectSubmissionSchema): Promise<SubmitProjectResponse> => {


    setError(null);
    setWarning(null);
    setIsSubmitting(true);
    setUploadProgress({});

    let submissionData = JSON.parse(JSON.stringify(data));

    if (submissionData.metadata?.sdgp_year) {
      submissionData.metadata.module = getModuleFromYear(submissionData.metadata.sdgp_year);
    }

    try {
      // Create an array to store all image upload tasks
      const uploadTasks: { id: string; promise: Promise<any> }[] = [];

      // Handle cover image
      if (data.metadata?.cover_image && data.metadata.cover_image instanceof File) {
        uploadTasks.push({
          id: 'cover_image',
          promise: handleImageUpload(data.metadata.cover_image, 'cover_image')
            .then(url => {
              submissionData = updateSubmissionPath(submissionData, 'cover_image', url);
            })
        });
      }

      // Handle logo image
      if (data.metadata?.logo && data.metadata.logo instanceof File) {
        uploadTasks.push({
          id: 'logo',
          promise: handleImageUpload(data.metadata.logo, 'logo')
            .then(url => {
              submissionData = updateSubmissionPath(submissionData, 'logo', url);
            })
        });
      }

      // Handle team member profile images
      if (data.team && data.team.length > 0) {
        data.team.forEach((member: any, index: number) => {
          if (member.profile_image && member.profile_image instanceof File) {
            uploadTasks.push({
              id: `team_member_${index}`,
              promise: handleImageUpload(member.profile_image, `team_member_${index}`)
                .then(url => {
                  submissionData = updateSubmissionPath(
                    submissionData,
                    `team_member_${index}`,
                    url
                  );
                })
            });
          }
        });
      }

      // Handle slides that might contain images
      if (data.slides && data.slides.length > 0) {
        data.slides.forEach((slide: any, index: number) => {
          // Check if slides_content is a File (for image slides)
          if (slide.slides_content instanceof File) {
            uploadTasks.push({
              id: `slide_${index}`,
              promise: handleImageUpload(slide.slides_content, `slide_${index}`)
                .then(url => {
                  submissionData = updateSubmissionPath(
                    submissionData,
                    `slide_${index}`,
                    url
                  );
                })
            });
          } else if (typeof slide.slides_content === 'string' &&
            slide.slides_content.length > 65535) {
            // Truncate if too long for database
            submissionData.slides[index].slides_content = slide.slides_content.substring(0, 65535);
          }
        });
      }

      // Use Promise.allSettled for better error handling
      const results = await Promise.allSettled(uploadTasks.map(task => task.promise));

      // Check for any failed uploads
      const failedUploads = results
        .map((result, index) => ({ result, task: uploadTasks[index] }))
        .filter(item => item.result.status === 'rejected');

      if (failedUploads.length > 0) {
        // Some uploads failed
        const failedItems = failedUploads.map(item => item.task.id).join(', ');

        // Set warning instead of throwing error
        setWarning(`Some images failed to upload: ${failedItems}. The form will be submitted without them.`);

        // Process anyway, with null values for failed uploads
        failedUploads.forEach(item => {
          submissionData = updateSubmissionPath(submissionData, item.task.id, null);
        });
      }

      // Final sanitization to ensure data is JSON serializable
      const sanitizedData = sanitizeSubmissionData(submissionData);

      try {
        // Submit to API using axios
        const response = await axios.post<SubmitProjectResponse>(`/api/projects/submit`, sanitizedData);
     
        setIsSubmitting(false);
        return response.data;
      } catch (err: any) {
        setIsSubmitting(false);

        const errorMessage = err.response?.data?.message || 'Failed to submit project';
        const errorDetails = err.response?.data?.details || err.response?.data?.error || '';
        const error = new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
        setError(error);

        console.error('API Error:', err.response?.data);

        return {
          success: false,
          message: errorMessage,
          code: err.response?.data?.code,
          details: err.response?.data?.details,
          error: err.response?.data?.error,
          errors: err.response?.data?.errors
        };
      }
    } catch (err) {
      setIsSubmitting(false);
      const error = err instanceof Error ? err : new Error('Unknown error occurred during submission');
      setError(error);
      console.error("Submission error:", error);

      return {
        success: false,
        message: error.message || 'Project submission failed',
      };
    }
  };

  return {
    submitProject,
    isSubmitting: isSubmitting || isUploadingImages,
    uploadProgress,
    error,
    warning
  };
};

export default useSubmitProject;
