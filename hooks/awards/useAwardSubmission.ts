import { useState } from 'react';
import { awardSubmissionSchema, AwardSubmissionInput } from '@/validations/award';

// Import upload image hook (same as project/competition)
import useUploadImageToBlob from '../azure/useUploadImageToBlob';

export function useAwardSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { uploadImage } = useUploadImageToBlob();

  const submitAward = async (data: AwardSubmissionInput) => {
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});
    setSuccess(false);

    // Validate with zod
    const result = awardSubmissionSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setValidationErrors(fieldErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      // 1. Upload image and get URL
      const imageUrl = await uploadImage(data.imageFile);
      if (!imageUrl) throw new Error('Image upload failed');

      // 2. Prepare JSON payload
      const payload = {
        name: data.awardName,
        image: imageUrl,
        competition_id: data.competitionId,
        project_id: data.projectId,
      };

      // 3. Submit award as JSON
      const res = await fetch('/api/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const responseBody = await res.json().catch(() => null);
        const msg =
          (responseBody && typeof responseBody.error === 'string' && responseBody.error) ||
          (responseBody && typeof responseBody.message === 'string' && responseBody.message) ||
          'Submission failed';
        setError(msg);
        setIsSubmitting(false);
        return false;
      }
      setSuccess(true);
      setIsSubmitting(false);
      return true;
    } catch (e: any) {
      setError(e.message || 'Submission failed');
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    isSubmitting,
    error,
    success,
    validationErrors,
    submitAward,
  };
}
