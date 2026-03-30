import { useState } from "react";
import axios from "axios";
import { projectSubmissionSchema, type ProjectSubmissionSchema } from "@/validations/submit_project";
import useUploadImageToBlob from "../azure/useUploadImageToBlob";
import { getModuleFromYear } from "@/lib/utils/module";
import type { SubmitProjectResponse } from "@/types/project/response";

type SubmitProjectEditResponse = SubmitProjectResponse & {
  data?: {
    editId?: string;
  };
};

export const useSubmitProjectEdit = (projectId: string) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { uploadImage, isLoading: isUploadingImages } = useUploadImageToBlob();

  const sanitizeSubmissionData = (data: any): any => {
    if (data === null || data === undefined) return data;
    if (typeof data !== "object") return data;

    // Prevent sending File objects directly; the API expects URLs.
    if (data instanceof File) return null;
    if (Array.isArray(data)) return data.map((item) => sanitizeSubmissionData(item));

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeSubmissionData(value);
    }
    return result;
  };

  const validateImage = (image: File): { valid: boolean; message?: string } => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(image.type)) {
      return {
        valid: false,
        message: `Unsupported file type: ${image.type}. Please use JPEG, PNG, GIF, WebP, or SVG.`,
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return {
        valid: false,
        message: `File too large (${(image.size / 1024 / 1024).toFixed(
          2
        )}MB). Maximum size is 5MB.`,
      };
    }
    return { valid: true };
  };

  const handleImageUpload = async (
    image: File | string | null | undefined,
    identifier: string
  ): Promise<string | null> => {
    if (!image) return null;
    if (typeof image === "string") return image; // already a URL
    if (!(image instanceof File)) return null;

    const validation = validateImage(image);
    if (!validation.valid) {
      setUploadProgress((prev) => ({ ...prev, [identifier]: -1 }));
      throw new Error(validation.message || "Invalid image file");
    }

    try {
      setUploadProgress((prev) => ({ ...prev, [identifier]: 0 }));
      const imageUrl = await uploadImage(image, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [identifier]: progress }));
      });
      setUploadProgress((prev) => ({ ...prev, [identifier]: 100 }));
      return imageUrl;
    } catch (err) {
      setUploadProgress((prev) => ({ ...prev, [identifier]: -1 }));
      throw err;
    }
  };

  const updateSubmissionPath = (
    data: any,
    identifier: string,
    value: any
  ): any => {
    const updatedData = { ...data };

    if (identifier === "cover_image") {
      if (!updatedData.metadata) updatedData.metadata = {};
      updatedData.metadata.cover_image = value;
    } else if (identifier === "logo") {
      if (!updatedData.metadata) updatedData.metadata = {};
      updatedData.metadata.logo = value;
    } else if (identifier.startsWith("team_member_")) {
      const index = parseInt(identifier.replace("team_member_", ""));
      if (!updatedData.team) updatedData.team = [];
      if (!updatedData.team[index]) updatedData.team[index] = {};
      updatedData.team[index].profile_image = value;
    } else if (identifier.startsWith("slide_")) {
      const index = parseInt(identifier.replace("slide_", ""));
      if (!updatedData.slides) updatedData.slides = [];
      if (!updatedData.slides[index]) updatedData.slides[index] = {};
      updatedData.slides[index].slides_content = value;
    }

    return updatedData;
  };

  const submitEdit = async (data: ProjectSubmissionSchema) => {
    setError(null);
    setWarning(null);
    setIsSubmitting(true);
    setUploadProgress({});

    const submissionData = JSON.parse(JSON.stringify(data));

    if (submissionData.metadata?.sdgp_year) {
      submissionData.metadata.module = getModuleFromYear(submissionData.metadata.sdgp_year);
    }

    try {
      const uploadTasks: { id: string; promise: Promise<any> }[] = [];

      if (data.metadata?.cover_image && data.metadata.cover_image instanceof File) {
        uploadTasks.push({
          id: "cover_image",
          promise: handleImageUpload(data.metadata.cover_image, "cover_image").then((url) => {
            submissionData.metadata.cover_image = url;
          }),
        });
      }

      if (data.metadata?.logo && data.metadata.logo instanceof File) {
        uploadTasks.push({
          id: "logo",
          promise: handleImageUpload(data.metadata.logo, "logo").then((url) => {
            submissionData.metadata.logo = url;
          }),
        });
      }

      if (data.team && data.team.length > 0) {
        data.team.forEach((member: any, index: number) => {
          if (member.profile_image && member.profile_image instanceof File) {
            uploadTasks.push({
              id: `team_member_${index}`,
              promise: handleImageUpload(member.profile_image, `team_member_${index}`).then((url) => {
                const updated = updateSubmissionPath(
                  submissionData,
                  `team_member_${index}`,
                  url
                );
                Object.assign(submissionData, updated);
              }),
            });
          }
        });
      }

      if (data.slides && data.slides.length > 0) {
        data.slides.forEach((slide: any, index: number) => {
          if (slide.slides_content instanceof File) {
            uploadTasks.push({
              id: `slide_${index}`,
              promise: handleImageUpload(slide.slides_content, `slide_${index}`).then((url) => {
                const updated = updateSubmissionPath(submissionData, `slide_${index}`, url);
                Object.assign(submissionData, updated);
              }),
            });
          }
        });
      }

      const results = await Promise.allSettled(uploadTasks.map((t) => t.promise));

      const failedUploads = results
        .map((result, idx) => ({ result, task: uploadTasks[idx] }))
        .filter((item) => item.result.status === "rejected");

      if (failedUploads.length > 0) {
        const failedItems = failedUploads.map((item) => item.task.id).join(", ");
        setWarning(`Some images failed to upload: ${failedItems}. The form will be submitted without them.`);
      }

      const sanitizedData = sanitizeSubmissionData(submissionData);

      const response = await axios.post<SubmitProjectEditResponse>(
        `/api/student/projects/${projectId}/edits`,
        sanitizedData
      );

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to submit project edit";
      const errorDetails = err.response?.data?.details || err.response?.data?.error || "";
      const e = new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
      setError(e);

      return {
        success: false,
        message: errorMessage,
        code: err.response?.data?.code,
        details: err.response?.data?.details,
        error: err.response?.data?.error,
        errors: err.response?.data?.errors,
      } satisfies SubmitProjectEditResponse;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitEdit,
    isSubmitting: isSubmitting || isUploadingImages,
    uploadProgress,
    error,
    warning,
  };
};

export default useSubmitProjectEdit;