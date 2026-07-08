import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Markdown from 'markdown-to-jsx';
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { validateImageFile } from "./utils/validateImageFile";
import { compressImageFile } from "./utils/compressImageFile";
import { FormStepIntro } from "./FormStepIntro";

const MAX_SLIDES = 10;
const MIN_SLIDES = 3;

interface FormStep2Props {
  slideFiles: File[];
  setSlideFiles: Dispatch<SetStateAction<File[]>>;
  slidePreviews: string[];
  setSlidePreviews: Dispatch<SetStateAction<string[]>>;
}

const FormStep2 = ({ slideFiles, setSlideFiles, slidePreviews, setSlidePreviews }: FormStep2Props) => {
  const { control, setValue, watch, setError, clearErrors } = useFormContext<ProjectSubmissionSchema>();
  const features = watch("projectDetails.features") || "";
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Keep form slides in sync with slidePreviews
    setValue(
      "slides",
      slidePreviews.map((url) => ({ slides_content: url })),
      { shouldValidate: true }
    );

    // Only validate slide count after user has interacted or has uploaded images
    if (hasInteracted || slidePreviews.length > 0) {
      if (slidePreviews.length < MIN_SLIDES) {
        setError("slides", {
          type: "manual",
          message: `You must upload at least ${MIN_SLIDES} images`
        });
      } else {
        clearErrors("slides");
      }
    }
  }, [slidePreviews, setValue, setError, clearErrors, hasInteracted]);

  useEffect(() => {
    // Initialize slides array if it doesn't exist
    if (!watch("slides")) {
      setValue("slides", []);
    }
    
    // Restore previews from form data if slidePreviews is empty but form has slides
    const formSlides = watch("slides");
    if (formSlides && formSlides.length > 0 && slidePreviews.length === 0) {
      const previewUrls = formSlides.map(slide => slide.slides_content);
      setSlidePreviews(previewUrls);
      setHasInteracted(true); // Mark as interacted since we have existing data
    }
  }, [setValue, watch, slidePreviews.length, setSlidePreviews]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Mark as interacted when user tries to upload
    setHasInteracted(true);
    
    const fileArray = Array.from(files);
    const remainingSlots = MAX_SLIDES - slidePreviews.length;
    
    if (fileArray.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}. Maximum ${MAX_SLIDES} images allowed.`);
      return;
    }
    
    if (slidePreviews.length + fileArray.length > MAX_SLIDES) {
      toast.error(`You can only upload a maximum of ${MAX_SLIDES} images.`);
      return;
    }
    
    setIsPlaceholderVisible(false);
    
    for (const file of fileArray) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        continue;
      }
      
      // Compress slide image before preview/upload
      const compressedFile = await compressImageFile(file, "slide");
      const reader = new FileReader();
      reader.onload = () => {
        setSlidePreviews(prev => [...prev, reader.result as string]);
        setSlideFiles(prev => [...prev, compressedFile]);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const removeSlideImage = (index: number) => {
    setHasInteracted(true); // Mark as interacted when removing images
    setSlidePreviews(prev => prev.filter((_, i) => i !== index));
    setSlideFiles(prev => prev.filter((_, i) => i !== index));
  };

  const canUploadMore = slidePreviews.length < MAX_SLIDES;

  return (
    <div className="space-y-6">
      <FormStepIntro
        step="Step 2 — Story"
        title="Details & gallery"
        description="Explain the problem and solution, describe features with Markdown, and upload at least three showcase images."
      />

      {/* Problem Statement */}
      <FormField
        control={control}
        name="projectDetails.problem_statement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Problem Statement<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea
                placeholder="What problem does your project solve?"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Solution */}
      <FormField
        control={control}
        name="projectDetails.solution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solution<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea
                placeholder="How does your project solve the problem?"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Features with Markdown */}
      <FormField
        control={control}
        name="projectDetails.features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Features<span className="text-red-500">*</span></FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormControl>
                  <Textarea
                    placeholder="Use Markdown: 
# Heading
- Bullet Point"
                    className="min-h-[300px] font-mono"
                    {...field}
                  />
                </FormControl>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 min-h-[300px] prose prose-sm dark:prose-invert max-w-none overflow-auto">
                <Markdown options={{
                  overrides: {
                    h1: { props: { className: 'text-2xl font-bold mb-4' } },
                    h2: { props: { className: 'text-xl font-bold mb-3' } },
                    h3: { props: { className: 'text-lg font-bold mb-2' } },
                    p: { props: { className: 'mb-4' } },
                    ul: { props: { className: 'list-disc pl-6 mb-4' } },
                    ol: { props: { className: 'list-decimal pl-6 mb-4' } },
                    li: { props: { className: 'mb-1' } }
                  }
                }}>
                  {features || "*Your markdown preview will appear here...*"}
                </Markdown>
              </div>
            </div>
            <FormDescription>Describe your project's key features using Markdown</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Slide Upload Section */}
      <FormField
        control={control}
        name="slides"
        render={() => (
          <FormItem>
            <FormLabel>Featured Images<span className="text-red-500">*</span></FormLabel>
            {canUploadMore && (
              <div className="relative mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/25 p-6 transition-all hover:border-primary/35 hover:bg-muted/40">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <Upload className="mb-2 h-10 w-10 text-primary" />
                  <p className="mb-1 text-sm text-foreground">
                    Drop images here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF — {slidePreviews.length}/{MAX_SLIDES} ({MAX_SLIDES - slidePreviews.length} left)
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
            )}
            <div className="text-xs font-normal text-muted-foreground mt-1">
              <span className={slidePreviews.length < MIN_SLIDES ? "text-red-500 font-medium" : ""}>
                Required: {MIN_SLIDES}-{MAX_SLIDES} images
              </span>
              {slidePreviews.length > 0 && (
                <span className="ml-2">
                  ({slidePreviews.length}/{MAX_SLIDES} uploaded)
                </span>
              )}
            </div>
            {slidePreviews.length >= MAX_SLIDES && (
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Maximum number of images reached. Remove an image to upload a new one.
              </div>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {slidePreviews.map((previewUrl, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-border shadow-sm transition-shadow hover:shadow-md"
                >
                  <AspectRatio ratio={16 / 9}>
                    <img src={previewUrl} alt={`Slide ${index + 1}`} className="object-cover w-full h-full rounded-lg" />
                  </AspectRatio>
                  <Button
                    type="button"
                    onClick={() => removeSlideImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormStep2;