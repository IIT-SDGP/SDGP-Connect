// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { competitionSchema, type CompetitionSchema } from "@/validations/competition";
import useUploadImageToBlob from "@/hooks/azure/useUploadImageToBlob";
import CompetitionSuccessPage from "./CompetitionSuccessPage";

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
  accept?: string;
}

function FileUpload({ label, onFileSelect, selectedFile, error, accept = "image/*" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
    
    // Create preview URL for images
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
        {selectedFile && previewUrl ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img 
                src={previewUrl} 
                alt={`Preview of ${label}`}
                className="max-w-full max-h-32 rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeFile}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                aria-label="Remove file"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload ${label}`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function CompForm() {
  const router = useRouter();
  const { uploadImage } = useUploadImageToBlob();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedCompetitionName, setSubmittedCompetitionName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<CompetitionSchema>({
    resolver: zodResolver(competitionSchema),
  });

  const watchedStartDate = watch("start_date");
  const watchedEndDate = watch("end_date");

  // Validate end date when start date changes
  React.useEffect(() => {
    if (watchedStartDate && watchedEndDate && watchedEndDate <= watchedStartDate) {
      setError("end_date", {
        type: "custom",
        message: "End date must be after start date",
      });
    } else {
      clearErrors("end_date");
    }
  }, [watchedStartDate, watchedEndDate, setError, clearErrors]);

  const onSubmit = async (data: CompetitionSchema) => {
    setIsSubmitting(true);
    try {
      // Upload logo and cover image
      const logoUrl = await uploadImage(data.logo);
      const coverImageUrl = await uploadImage(data.cover_image);

      // Submit competition data
      const competitionData = {
        name: data.name,
        type: data.type,
        description: data.description,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        logo: logoUrl,
        cover_image: coverImageUrl,
      };

      const response = await fetch("/api/competition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit competition");
      }

      setSubmittedCompetitionName(data.name);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting competition:", error);
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return <CompetitionSuccessPage competitionName={submittedCompetitionName} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl space-y-6">
        {/* Competition Form */}
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Submit Competition
          </h3>
          <p className="text-muted-foreground mb-6">
            Create a new competition for the SDGP platform
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              {/* Competition Name */}
              <div className="col-span-full">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Competition Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("name")}
                  type="text"
                  id="name"
                  placeholder="Expo Awards - 2025"
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-full">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  {...register("description")}
                  id="description"
                  placeholder="Describe your competition, its goals, rules, and what participants can expect..."
                  className="mt-2 min-h-[120px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Start Date */}
              <div className="col-span-full sm:col-span-3">
                <Label className="text-sm font-medium text-foreground">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  <DatePicker
                    date={watchedStartDate}
                    onDateChange={(date) => setValue("start_date", date!)}
                    placeholder="Select start date"
                  />
                </div>
                {errors.start_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.start_date.message}</p>
                )}
              </div>

              {/* End Date */}
              <div className="col-span-full sm:col-span-3">
                <Label className="text-sm font-medium text-foreground">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  <DatePicker
                    date={watchedEndDate}
                    onDateChange={(date) => setValue("end_date", date!)}
                    placeholder="Select end date"
                  />
                </div>
                {errors.end_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.end_date.message}</p>
                )}
              </div>

              {/* Competition Type */}
              <div className="col-span-full">
                <Label htmlFor="type" className="text-sm font-medium text-foreground">
                  Competition Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("type", value as any)}>
                  <SelectTrigger className="mt-2" id="type">
                    <SelectValue placeholder="Select competition type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HACKATHON">Hackathon</SelectItem>
                    <SelectItem value="IDEATHON">Ideathon</SelectItem>
                    <SelectItem value="EXPO">Expo</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div className="col-span-full sm:col-span-3">
                <FileUpload
                  label="Competition Logo"
                  onFileSelect={(file) => setValue("logo", file!)}
                  selectedFile={watch("logo")}
                  error={errors.logo?.message ? String(errors.logo.message) : undefined}
                />
              </div>

              {/* Cover Image Upload */}
              <div className="col-span-full sm:col-span-3">
                <FileUpload
                  label="Cover Image"
                  onFileSelect={(file) => setValue("cover_image", file!)}
                  selectedFile={watch("cover_image")}
                  error={errors.cover_image?.message ? String(errors.cover_image.message) : undefined}
                />
              </div>
            </div>

            <Separator className="my-6" />
            
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Competition"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Guidelines Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Competition Submission Guidelines
          </h2>
          <p className="text-muted-foreground mb-4">
            Please review the following guidelines before submitting your competition.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              <span>All competitions are subject to admin review and approval</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              <span>You will be notified via email once your competition is approved</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              <span>Ensure end date is after start date for proper scheduling</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              <span>Upload high-quality images for logo and cover (recommended: 1920x1080 for cover)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}