'use client'
import { Dispatch, SetStateAction } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Upload, X, AlertTriangle, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { validateImageFile } from "./utils/validateImageFile";
import { compressImageFile } from "./utils/compressImageFile";
import { toast } from "sonner";
import { FormStepIntro } from "./FormStepIntro";

interface FormStep5Props {
  teamProfileFiles: (File|null)[];
  setTeamProfileFiles: Dispatch<SetStateAction<(File|null)[]>>;
  teamProfilePreviews: (string|null)[];
  setTeamProfilePreviews: Dispatch<SetStateAction<(string|null)[]>>;
}

const FormStep5 = ({
  teamProfileFiles,
  setTeamProfileFiles,
  teamProfilePreviews,
  setTeamProfilePreviews
}: FormStep5Props) => {
  const { control, setValue, watch } = useFormContext<ProjectSubmissionSchema>();
  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
    control,
    name: "team",
  });

  // Add a new team member
  const addTeamMember = () => {
    appendTeam({ name: "", linkedin_url: "", profile_image: null });
    setTeamProfileFiles((prev) => [...prev, null]);
    setTeamProfilePreviews((prev) => [...prev, null]);
  };

  // Remove a team member
  const handleRemoveTeam = (index: number) => {
    removeTeam(index);
    setTeamProfileFiles((prev) => prev.filter((_, i) => i !== index));
    setTeamProfilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to clean and validate LinkedIn URLs
  const cleanLinkedInUrl = (url: string): { cleanUrl: string; isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { cleanUrl: "", isValid: true };
    }

    try {
      // Add https:// if no protocol is provided
      let fullUrl = url.trim();
      if (!fullUrl.match(/^https?:\/\//)) {
        fullUrl = `https://${fullUrl}`;
      }

      const urlObj = new URL(fullUrl);
      
      // LinkedIn-specific validation and cleaning
      if (!urlObj.hostname.includes('linkedin.com')) {
        return { cleanUrl: url, isValid: false, error: "Must be a LinkedIn URL" };
      }
      
      // Clean LinkedIn URL: remove query parameters and hash
      const linkedinUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
      return { cleanUrl: linkedinUrl, isValid: linkedinUrl.length <= 150 };
    } catch (error) {
      return { cleanUrl: url, isValid: false, error: "Invalid URL format" };
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setTeamProfilePreviews((prev) => {
        const arr = [...prev];
        arr[index] = null;
        return arr;
      });
      setTeamProfileFiles((prev) => {
        const arr = [...prev];
        arr[index] = null;
        return arr;
      });
      return toast.error(error);
    }
    // Compress team profile image before preview/upload
    const compressedFile = await compressImageFile(file, "team");
    const reader = new FileReader();
    reader.onload = () => {
      setTeamProfilePreviews((prev) => {
        const arr = [...prev];
        arr[index] = reader.result as string;
        return arr;
      });
      setTeamProfileFiles((prev) => {
        const arr = [...prev];
        arr[index] = compressedFile;
        return arr;
      });
    };
    reader.readAsDataURL(compressedFile);
  };

  // Clear profile image
  const clearProfileImage = (index: number) => {
    setValue(`team.${index}.profile_image`, null, { shouldValidate: true });
    setTeamProfilePreviews((prev) => {
      const arr = [...prev];
      arr[index] = null;
      return arr;
    });
    setTeamProfileFiles((prev) => {
      const arr = [...prev];
      arr[index] = null;
      return arr;
    });
  };

  return (
    <div className="space-y-8">
      <FormStepIntro
        step="Step 5 — Team"
        title="Who shipped it"
        description="Add everyone who should appear on the project—names, optional LinkedIn, and profile photos."
      />

      {/* Team Members */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel className="text-base">Team Members</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTeamMember}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {teamFields.map((field, index) => {
          const currentLinkedInUrl = watch(`team.${index}.linkedin_url`) || "";
          const linkedInValidation = cleanLinkedInUrl(currentLinkedInUrl);

          return (
            <div
              key={field.id}
              className="space-y-4 rounded-xl border border-border/80 bg-muted/15 p-4 sm:p-5"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-foreground">Member {index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTeam(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-[1fr_1fr] gap-4">
                <div className="space-y-4">
                  {/* Name */}
                  <FormField
                    control={control}
                    name={`team.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn URL */}
                  <FormField
                    control={control}
                    name={`team.${index}.linkedin_url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile (optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="https://linkedin.com/in/..." 
                              {...field}
                              onBlur={(e) => {
                                const { cleanUrl, isValid } = cleanLinkedInUrl(e.target.value);
                                if (isValid && cleanUrl !== e.target.value) {
                                  field.onChange(cleanUrl);
                                }
                                field.onBlur();
                              }}
                              className={
                                currentLinkedInUrl && !linkedInValidation.isValid 
                                  ? "border-red-500 focus:border-red-500" 
                                  : currentLinkedInUrl && linkedInValidation.isValid 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                              }
                            />
                            {currentLinkedInUrl && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                {linkedInValidation.isValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        
                        {/* LinkedIn URL Validation Messages */}
                        {currentLinkedInUrl && (
                          <div className="ml-0">
                            {!linkedInValidation.isValid && linkedInValidation.error && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {linkedInValidation.error}
                              </p>
                            )}
                            {linkedInValidation.isValid && linkedInValidation.cleanUrl !== currentLinkedInUrl && (
                              <p className="text-sm text-blue-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                URL will be cleaned to: {linkedInValidation.cleanUrl}
                              </p>
                            )}
                            {linkedInValidation.isValid && linkedInValidation.cleanUrl === currentLinkedInUrl && currentLinkedInUrl && (
                              <p className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Valid LinkedIn URL
                              </p>
                            )}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Profile Image */}
                <FormField
                  control={control}
                  name={`team.${index}.profile_image`}
                  render={() => (
                    <FormItem>
                      <FormLabel>Profile Photo (optional)</FormLabel>
                      <div className="flex justify-center">
                        <AnimatePresence>
                          {!teamProfilePreviews[index] ? (
                            <motion.label
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-full h-32 w-32 cursor-pointer bg-muted/30 transition-colors hover:border-primary/40"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleProfileImageUpload(e, index)}
                                className="hidden"
                              />
                            </motion.label>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              onClick={() => clearProfileImage(index)}
                              className="relative flex justify-center cursor-pointer group"
                            >
                              <Avatar className="h-32 w-32 border-2 border-primary">
                                <AvatarImage 
                                  src={teamProfilePreviews[index] || ""} 
                                  alt="Team member profile" 
                                />
                                <AvatarFallback>
                                  {field.name.split(' ').map(name => name[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <X className="h-8 w-8 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}

        {teamFields.length === 0 && (
          <p className="text-sm text-muted-foreground">No team members added yet.</p>
        )}
      </div>
    </div>
  );
};

export default FormStep5;