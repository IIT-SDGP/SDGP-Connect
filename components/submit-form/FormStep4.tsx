import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { SocialTypeEnum } from "@/types/prisma-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React from "react";
import { FormStepIntro } from "./FormStepIntro";

const FormStep4 = () => {
  const { control, watch, setValue } = useFormContext<ProjectSubmissionSchema>();
  
  // Watch country code and phone number to combine them
  const countryCode = watch("projectDetails.country_code");
  const phoneNumber = watch("projectDetails.phone_number");
  
  // Initialize default country code immediately when component mounts
  React.useEffect(() => {

    setValue("projectDetails.country_code", "+94", { 
      shouldValidate: false,
      shouldDirty: false 
    });
  }, [setValue]);
  
  // Use useFieldArray for handling the socialLinks array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  // Add a new empty social link
  const addSocialLink = () => {
    append({ link_name: SocialTypeEnum.LINKEDIN, url: "" });
  };

  // Function to clean and validate social media URLs
  const cleanSocialUrl = (url: string, platform: SocialTypeEnum): { cleanUrl: string; isValid: boolean; error?: string } => {
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
      
      // Platform-specific validation and cleaning
      switch (platform) {
        case SocialTypeEnum.INSTAGRAM:
          if (!urlObj.hostname.includes('instagram.com')) {
            return { cleanUrl: url, isValid: false, error: "Must be an Instagram URL" };
          }
          // Clean Instagram URL: keep only the username part
          const instagramMatch = urlObj.pathname.match(/^\/([a-zA-Z0-9._]+)\/?/);
          if (instagramMatch) {
            const cleanUrl = `https://www.instagram.com/${instagramMatch[1]}`;
            return { cleanUrl, isValid: cleanUrl.length <= 100 };
          }
          return { cleanUrl: url, isValid: false, error: "Invalid Instagram profile URL" };

        case SocialTypeEnum.LINKEDIN:
          if (!urlObj.hostname.includes('linkedin.com')) {
            return { cleanUrl: url, isValid: false, error: "Must be a LinkedIn URL" };
          }
          // Clean LinkedIn URL: remove query parameters and hash
          const linkedinUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
          return { cleanUrl: linkedinUrl, isValid: linkedinUrl.length <= 150 };

        case SocialTypeEnum.TWITTER:
          if (!urlObj.hostname.includes('twitter.com') && !urlObj.hostname.includes('x.com')) {
            return { cleanUrl: url, isValid: false, error: "Must be a Twitter/X URL" };
          }
          // Clean Twitter URL: keep only the username part
          const twitterMatch = urlObj.pathname.match(/^\/([a-zA-Z0-9_]+)\/?/);
          if (twitterMatch) {
            const cleanUrl = `https://twitter.com/${twitterMatch[1]}`;
            return { cleanUrl, isValid: cleanUrl.length <= 100 };
          }
          return { cleanUrl: url, isValid: false, error: "Invalid Twitter profile URL" };

        case SocialTypeEnum.FACEBOOK:
          if (!urlObj.hostname.includes('facebook.com')) {
            return { cleanUrl: url, isValid: false, error: "Must be a Facebook URL" };
          }
          // Clean Facebook URL: remove query parameters
          const facebookUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
          return { cleanUrl: facebookUrl, isValid: facebookUrl.length <= 150 };

        case SocialTypeEnum.YOUTUBE:
          if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
            return { cleanUrl: url, isValid: false, error: "Must be a YouTube URL" };
          }
          // For YouTube, we'll accept both channel and video URLs but clean them
          const youtubeUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
          return { cleanUrl: youtubeUrl, isValid: youtubeUrl.length <= 150 };

        case SocialTypeEnum.TIKTOK:
          if (!urlObj.hostname.includes('tiktok.com')) {
            return { cleanUrl: url, isValid: false, error: "Must be a TikTok URL" };
          }
          // Clean TikTok URL: keep only the username part
          const tiktokMatch = urlObj.pathname.match(/^\/@([a-zA-Z0-9._]+)\/?/);
          if (tiktokMatch) {
            const cleanUrl = `https://www.tiktok.com/@${tiktokMatch[1]}`;
            return { cleanUrl, isValid: cleanUrl.length <= 100 };
          }
          return { cleanUrl: url, isValid: false, error: "Invalid TikTok profile URL" };

        default:
          // Generic URL cleaning: remove query parameters and hash
          const genericUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
          return { cleanUrl: genericUrl, isValid: genericUrl.length <= 200 };
      }
    } catch (error) {
      return { cleanUrl: url, isValid: false, error: "Invalid URL format" };
    }
  };

  // Update the combined phone field whenever country code or phone number changes
  const updateCombinedPhone = (newCountryCode?: string, newPhoneNumber?: string) => {
    const currentCountryCode = newCountryCode || countryCode || "+94";
    const currentPhoneNumber = newPhoneNumber || phoneNumber || "";
    
   
    
    if (currentCountryCode && currentPhoneNumber) {
      const combinedPhone = `${currentCountryCode}${currentPhoneNumber}`;
      setValue("projectDetails.team_phone", combinedPhone, {
        shouldValidate: false, // Don't validate immediately to avoid conflicts
        shouldDirty: true
      });
    } else {
      setValue("projectDetails.team_phone", "", {
        shouldValidate: false,
        shouldDirty: true
      });
    }
  };

  return (
    <div className="space-y-8">
      <FormStepIntro
        step="Step 4 — Contact"
        title="Reach you & your channels"
        description="Primary email and phone for reviewer questions, plus optional social links."
      />

      {/* Team Email */}
      <FormField
        control={control}
        name="projectDetails.team_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Email<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="info@lexi.lk"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Team Phone with Country Code */}
      <div className="space-y-4">
        <FormLabel className="text-base">Team Phone (or primary Contact)<span className="text-red-500">*</span></FormLabel>
        <FormDescription>
          Enter your country code and phone number. They will be combined automatically.
        </FormDescription>
        
        <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
          {/* Country Code */}
          <FormField
            control={control}
            name="projectDetails.country_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Country Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="+94"
                    {...field}
                    value={field.value || "+94"}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ensure it starts with + if user enters numbers
                      const formattedValue = value.startsWith('+') ? value : value ? `+${value.replace(/^\+/, '')}` : '';
                      field.onChange(formattedValue);
                      updateCombinedPhone(formattedValue, phoneNumber);
                    }}
                    onBlur={(e) => {
                      // Validate country code format on blur
                      const value = e.target.value;
                      if (value && !value.match(/^\+\d{1,4}$/)) {
                        // If invalid format, set to default +94
                        field.onChange('+94');
                        updateCombinedPhone('+94', phoneNumber);
                      }
                    }}
                  />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={control}
            name="projectDetails.phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="0771234567"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                      if (value.length <= 10) { // Limit to 10 digits
                        field.onChange(value);
                        updateCombinedPhone(countryCode, value);
                      }
                    }}
                    maxLength={10}
                  />
                </FormControl>
                <div className="min-h-[1.25rem]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Display Combined Phone Number */}
        {(countryCode || "+94") && phoneNumber && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm text-muted-foreground">Combined phone:</p>
            <p className="font-medium">{countryCode || "+94"}{phoneNumber}</p>
          </div>
        )}

        {/* Hidden field for the combined phone number */}
        <FormField
          control={control}
          name="projectDetails.team_phone"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <FormLabel className="text-base">Social Links</FormLabel>
            <FormDescription className="text-sm mt-1">
              URLs will be automatically cleaned and validated. Tracking parameters will be removed.
            </FormDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSocialLink}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No social links added yet.</p>
        ) : (
          fields.map((field, index) => {
            const currentUrl = watch(`socialLinks.${index}.url`) || "";
            const currentPlatform = watch(`socialLinks.${index}.link_name`) || SocialTypeEnum.LINKEDIN;
            const urlValidation = cleanSocialUrl(currentUrl, currentPlatform);

            return (
              <div key={field.id} className="space-y-3">
                <div className="grid grid-cols-[1fr_2fr_auto] gap-4">
                  <FormField
                    control={control}
                    name={`socialLinks.${index}.link_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={SocialTypeEnum.LINKEDIN}>LinkedIn</SelectItem>
                              <SelectItem value={SocialTypeEnum.TWITTER}>Twitter</SelectItem>
                              <SelectItem value={SocialTypeEnum.INSTAGRAM}>Instagram</SelectItem>
                              <SelectItem value={SocialTypeEnum.FACEBOOK}>Facebook</SelectItem>
                              <SelectItem value={SocialTypeEnum.YOUTUBE}>YouTube</SelectItem>
                              <SelectItem value={SocialTypeEnum.TIKTOK}>TikTok</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="URL (e.g., https://linkedin.com/...)" 
                              {...field}
                              onBlur={(e) => {
                                const { cleanUrl, isValid } = cleanSocialUrl(e.target.value, currentPlatform);
                                if (isValid && cleanUrl !== e.target.value) {
                                  field.onChange(cleanUrl);
                                }
                                field.onBlur();
                              }}
                              className={
                                currentUrl && !urlValidation.isValid 
                                  ? "border-red-500 focus:border-red-500" 
                                  : currentUrl && urlValidation.isValid 
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                              }
                            />
                            {currentUrl && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                {urlValidation.isValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="self-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* URL Validation Messages */}
                {currentUrl && (
                  <div className="ml-0">
                    {!urlValidation.isValid && urlValidation.error && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {urlValidation.error}
                      </p>
                    )}
                    {urlValidation.isValid && urlValidation.cleanUrl !== currentUrl && (
                      <p className="text-sm text-blue-600 flex items-center gap-1 dark:text-blue-400">
                        <CheckCircle className="h-3 w-3" />
                        URL will be cleaned to: {urlValidation.cleanUrl}
                      </p>
                    )}
                    {urlValidation.isValid && urlValidation.cleanUrl === currentUrl && currentUrl && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Valid URL
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormStep4;