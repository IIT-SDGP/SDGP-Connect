'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { compressImageFile } from "./utils/compressImageFile";
import FormStepper from "./FormStepper";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSubmissionSchema, ProjectSubmissionSchema } from "@/validations/submit_project";
import SuccessPage from "./SuccessPage";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep4 from "./FormStep4";
import FormStep5 from "./FormStep5";
import { toast } from "sonner";
import { useSubmitProject } from "@/hooks/project/useSubmitProject";
import { Loader2 } from "lucide-react";
import useUploadImageToBlob from "@/hooks/azure/useUploadImageToBlob";
import { UploadingSequence } from "@/components/ui/UploadingSequence";
import { ProjectStatusEnum } from "@/types/prisma-types";
import type { SubmitProjectResponse } from "@/types/project/response";

const TOTAL_STEPS = 5;

const ProjectSubmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedProjectId, setSubmittedProjectId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [slideFiles, setSlideFiles] = useState<File[]>([]);
  const [slidePreviews, setSlidePreviews] = useState<string[]>([]);
  const [teamProfileFiles, setTeamProfileFiles] = useState<(File | null)[]>([null]);
  const [teamProfilePreviews, setTeamProfilePreviews] = useState<(string | null)[]>([null]);
  const { uploadImage } = useUploadImageToBlob();
  const router = useRouter();

  // Use our custom submission hook
  const { submitProject, isSubmitting, error } = useSubmitProject();
  const buildCopyPayload = (result: Partial<SubmitProjectResponse>, fallbackError?: unknown) => {
    const payload: Record<string, any> = {
      message: result.message,
      code: result.code,
      details: result.details || result.error,
    };

    if (Array.isArray(result.errors) && result.errors.length) {
      payload.validation = result.errors.slice(0, 5).map((e: any) => ({
        path: Array.isArray(e.path) ? e.path.join(".") : e.path,
        message: e.message,
      }));
    }

    if (fallbackError instanceof Error) {
      payload.clientError = fallbackError.message;
    }

    return JSON.stringify(payload, null, 2);
  };

  const truncate = (text: string, max = 160) =>
    text.length > max ? `${text.slice(0, max - 1)}…` : text;

  const showSubmitErrorToast = (result: Partial<SubmitProjectResponse>, fallbackError?: unknown) => {
    const validationMessage =
      Array.isArray(result.errors) && result.errors.length
        ? result.errors[0]?.message
        : undefined;

    const description = truncate(
      validationMessage ||
        result.details ||
        result.error ||
        result.message ||
        "There was an error submitting your project."
    );

    const copyPayload = buildCopyPayload(
      {
        message: result.message || "Submission failed",
        code: result.code,
        details: result.details,
        error: result.error,
        errors: result.errors,
      },
      fallbackError
    );

    toast.error("Submission Failed", {
      description,
      action: {
        label: "Copy",
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(copyPayload);
            toast.success("Copied error details");
          } catch {
            toast.error("Failed to copy");
          }
        },
      },
    });
  };

  const methods = useForm<ProjectSubmissionSchema>({
    resolver: zodResolver(projectSubmissionSchema),
    defaultValues: {
      metadata: {
        sdgp_year: "",
        group_num: "",
        title: "",
        subtitle: "",
        website: "",
        cover_image: null, // Changed from placeholder URL to null
        logo: null, // Changed from placeholder URL to null
      },
      projectDetails: {
        problem_statement: "",
        solution: "",
        features: "",
        team_email: "",
        team_phone: "",
      },
      status: {
        status: ProjectStatusEnum.IDEA,
      },
      domains: [],
      projectTypes: [],
      sdgGoals: [],
      techStack: [],
      team: [{ name: "", linkedin_url: "", profile_image: null }],
      socialLinks: [],
      slides: []
    },
    mode: "onBlur",
  });

  // Effect to restore slide previews when navigating back to step 2
  useEffect(() => {
    if (currentStep === 2) {
      const formSlides = methods.getValues("slides");
      if (formSlides && formSlides.length > 0 && slidePreviews.length === 0) {
        // If form has slides but previews are empty, restore previews from form data
        const previewUrls = formSlides.map(slide => slide.slides_content);
        setSlidePreviews(previewUrls);
      }
    }
  }, [currentStep, methods, slidePreviews.length]);

  const handleNext = async () => {
    // Updated field mapping with all required fields for each step
    const stepFieldsMap = {
      1: [
        "metadata.group_num",
        "metadata.sdgp_year",
        "metadata.title",
        "metadata.subtitle",
        "metadata.website", // Added website validation
        "metadata.cover_image", // Added cover image validation
        "metadata.logo" // Added logo validation
      ],
      2: [
        "projectDetails.problem_statement",
        "projectDetails.solution",
        "projectDetails.features",
        "slides"
      ],
      3: [
        "techStack",
        "projectTypes",
        "status.status",
        "sdgGoals",
        "domains"
      ],
      4: [
        "socialLinks",
        "projectDetails.team_email",
        "projectDetails.country_code",  
        "projectDetails.phone_number", 
        "projectDetails.team_phone"     
      ],
      5: [
        "team"
      ],
    };

    const fieldsToValidate = stepFieldsMap[currentStep as keyof typeof stepFieldsMap];

    // Validate all fields for the current step
    const results = await Promise.all(
      fieldsToValidate.map(field => methods.trigger(field as any))
    );

    const isValid = results.every(result => result === true);

    if (!isValid) {
      // Get the current errors to provide more specific feedback
      const errors = methods.formState.errors;


      toast.error("Please complete all required fields", {
        description: "Check the highlighted fields and ensure all required information is provided.",
      });
      return;
    }

    // Additional validation for step 1 - ensure files are actually uploaded
    if (currentStep === 1) {
      if (!logoFile) {
        toast.error("Logo is required", {
          description: "Please upload a logo for your project.",
        });
        return;
      }
      if (!coverFile) {
        toast.error("Cover image is required", {
          description: "Please upload a cover image for your project.",
        });
        return;
      }

      // Upload images
      setUploading(true);
      try {
        const compressedLogo = await compressImageFile(logoFile, "logo");
        const logoUrl = await uploadImage(compressedLogo);
        methods.setValue("metadata.logo", logoUrl, { shouldValidate: true });

        const compressedCover = await compressImageFile(coverFile, "cover_image");
        const coverUrl = await uploadImage(compressedCover);
        methods.setValue("metadata.cover_image", coverUrl, { shouldValidate: true });
      } catch (err) {
        toast.error("Image upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Upload slides if on step 2
    if (currentStep === 2) {
      setUploading(true);
      try {
        if (slideFiles.length > 0) {
          const urls = [];
          for (const file of slideFiles) {
            const compressedSlide = await compressImageFile(file, "slide");
            const url = await uploadImage(compressedSlide);
            urls.push(url);
          }
          methods.setValue(
            "slides",
            urls.map((url) => ({ slides_content: url })),
            { shouldValidate: true }
          );

          // Don't clear the previews anymore - keep them for navigation
          // Instead, update previews with the uploaded URLs
          setSlidePreviews(urls);
          setSlideFiles([]); // Clear files but keep previews
        }
      } catch (err) {
        toast.error("Slide image upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Upload team profile images if on step 5
    if (currentStep === 5) {
      setUploading(true);
      try {
        const currentTeam = methods.getValues("team");
        const updatedTeam = await Promise.all(
          currentTeam.map(async (member, i) => {
            const file = teamProfileFiles[i];
            if (file) {
              const compressedTeam = await compressImageFile(file, "team");
              const url = await uploadImage(compressedTeam);
              return { ...member, profile_image: url };
            }
            return member;
          })
        );
        methods.setValue("team", updatedTeam, { shouldValidate: true });
        setTeamProfileFiles(updatedTeam.map(() => null));
        setTeamProfilePreviews(updatedTeam.map(() => null));
      } catch (err) {
        toast.error("Team profile image upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit: SubmitHandler<ProjectSubmissionSchema> = async (data) => {
    try {
      // Handle team profile image uploads before final submission
      // Check if there are any profile images to upload
      const hasProfileImages = teamProfileFiles.some(file => file !== null);

      if (hasProfileImages) {
        setUploading(true);
        try {
          const currentTeam = [...data.team]; // Create a copy of the team array

          const updatedTeam = await Promise.all(
            currentTeam.map(async (member, i) => {
              const file = teamProfileFiles[i];
              if (file) {
                const url = await uploadImage(file);
                return { ...member, profile_image: url };
              }
              return member;
            })
          );

          // Update the data that will be submitted with the new team data including image URLs
          data = {
            ...data,
            team: updatedTeam
          };

        } catch (err) {
          console.error("Error uploading team profile images:", err);
          toast.error("Team profile image upload failed. Please try again.");
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Submit the project using our hook
      const result = await submitProject(data);

      if (result.success && result.data?.projectId) {
        // Show success message
        toast.success("Project Submitted!", {
          description: "Your project has been successfully submitted.",
        });

        // Store the project ID for use in the success page
        setSubmittedProjectId(result.data.projectId);
        setIsSubmitted(true);

        // redirect to the project page after a delay
        setTimeout(() => {
          router.push(`/project/${result?.data?.projectId}`);
        }, 3000);
      } else {
        showSubmitErrorToast(result);
      }
    } catch (err) {
      console.error("Error during submission:", err);
      showSubmitErrorToast({ message: "An unexpected error occurred" }, err);
    }
  };

  if (isSubmitted) {
    return <SuccessPage projectId={submittedProjectId} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            logoPreviewUrl={logoPreviewUrl}
            setLogoPreviewUrl={setLogoPreviewUrl}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            coverPreviewUrl={coverPreviewUrl}
            setCoverPreviewUrl={setCoverPreviewUrl}
          />
        );
      case 2:
        return (
          <FormStep2
            slideFiles={slideFiles}
            setSlideFiles={setSlideFiles}
            slidePreviews={slidePreviews}
            setSlidePreviews={setSlidePreviews}
          />
        );
      case 3:
        return <FormStep3 />;
      case 4:
        return <FormStep4 />;
      case 5:
        return (
          <FormStep5
            teamProfileFiles={teamProfileFiles}
            setTeamProfileFiles={setTeamProfileFiles}
            teamProfilePreviews={teamProfilePreviews}
            setTeamProfilePreviews={setTeamProfilePreviews}
          />
        );
      default:
        return (
          <FormStep1
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            logoPreviewUrl={logoPreviewUrl}
            setLogoPreviewUrl={setLogoPreviewUrl}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            coverPreviewUrl={coverPreviewUrl}
            setCoverPreviewUrl={setCoverPreviewUrl}
          />
        );
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-background border md:p-8">
        <FormStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {renderStep()}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting || uploading}
            >
              Previous
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || uploading}
              >
                {(isSubmitting || uploading) ? (
                  <UploadingSequence />
                ) : (
                  "Next"
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || uploading}
              >
                {(isSubmitting || uploading) ? (
                  <UploadingSequence />
                ) : (
                  "Submit Project"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default ProjectSubmissionForm;
