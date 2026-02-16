import { Dispatch, SetStateAction, useState } from "react";
import useUploadImageToBlob from "@/hooks/azure/useUploadImageToBlob";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";
import { toast } from "sonner";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue , SelectLabel , SelectGroup } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { validateImageFile } from "./utils/validateImageFile";
import { compressImageFile } from "./utils/compressImageFile";
import { yearOptions } from "@/lib/types/mapping";

interface FormStep1Props {
  logoFile: File | null;
  setLogoFile: Dispatch<SetStateAction<File | null>>;
  logoPreviewUrl: string | null;
  setLogoPreviewUrl: Dispatch<SetStateAction<string | null>>;
  coverFile: File | null;
  setCoverFile: Dispatch<SetStateAction<File | null>>;
  coverPreviewUrl: string | null;
  setCoverPreviewUrl: Dispatch<SetStateAction<string | null>>;
}

const FormStep1 = ({
  logoFile,
  setLogoFile,
  logoPreviewUrl,
  setLogoPreviewUrl,
  coverFile,
  setCoverFile,
  coverPreviewUrl,
  setCoverPreviewUrl,
}: FormStep1Props) => {
  const { control, setValue } = useFormContext<ProjectSubmissionSchema>();
  const [coverError, setCoverError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const { uploadImage } = useUploadImageToBlob();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover_image" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      if (type === "cover_image") setCoverError(error);
      if (type === "logo") setLogoError(error);
      return;
    } else {
      if (type === "cover_image") setCoverError(null);
      if (type === "logo") setLogoError(null);
    }
    
    // Compress image before preview and upload
    const compressedFile = await compressImageFile(file, type);
    const reader = new FileReader();
    reader.onload = () => {
      if (type === "cover_image") setCoverPreviewUrl(reader.result as string);
      if (type === "logo") setLogoPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(compressedFile);
    
    if (type === "cover_image") {
      setCoverFile(compressedFile);
      // Set the actual file in the form
      setValue("metadata.cover_image", compressedFile, { shouldValidate: true });
    }
    if (type === "logo") {
      setLogoFile(compressedFile);
      // Set the actual file in the form
      setValue("metadata.logo", compressedFile, { shouldValidate: true });
    }
  };

  const clearImage = () => {
    // Clear the form value (set to null/undefined instead of placeholder URL)
    setValue("metadata.cover_image", null, { shouldValidate: true });
    setCoverPreviewUrl(null);
    setCoverFile(null);
    setCoverError(null);
  };

  const clearLogo = () => {
    // Clear the form value (set to null/undefined instead of placeholder URL)
    setValue("metadata.logo", null, { shouldValidate: true });
    setLogoPreviewUrl(null);
    setLogoFile(null);
    setLogoError(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Project Basics</h2>

      {/* Row 1: Group Number & SDGP Year */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="metadata.group_num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Number</FormLabel>
              <FormControl>
                <Input placeholder="Eg: CS-27" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="metadata.sdgp_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SDGP Year<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Dynamically group and render year options by type */}
                    {Array.from(new Set(yearOptions.map(opt => opt.type))).map(type => (
                      <SelectGroup key={type}>
                        <SelectLabel>{type}</SelectLabel>
                        {yearOptions.filter(opt => opt.type === type).map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Row 2: Title */}
      <FormField
        control={control}
        name="metadata.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Ex: LEXi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Row 3: Subtitle */}
      <FormField
        control={control}
        name="metadata.subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Subtitle (e.g., An AI-powered platform for Dyslexic Students)" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Row 4: Website URL */}
      <FormField
        control={control}
        name="metadata.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Website<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://www.lexi.lk"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Include HTTPS:// or HTTP:// in your URL (e.g., https://example.com)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Row 5: Logo & Cover Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Logo */}
        <FormField
          control={control}
          name="metadata.logo"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                App Logo <span className="text-red-500">*</span>
              </FormLabel>
              <div className="space-y-4">
                <AnimatePresence>
                  {logoFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={clearLogo}
                      className="relative flex justify-center cursor-pointer group"
                    >
                      <Avatar className="h-36 w-36 border-2 border-primary rounded-full">
                        <AvatarImage src={logoPreviewUrl!} alt="App logo" />
                        <AvatarFallback>LOGO</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <X className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-full h-36 w-36 mx-auto cursor-pointer dark:border-zinc-600"
                    >
                      <Upload className="h-10 w-10 text-zinc-400 mb-2" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        className="hidden"
                      />
                    </motion.label>
                  )}
                </AnimatePresence>
                {(logoError || fieldState.error) && (
                  <div className="text-red-500 text-xs text-center">
                    {logoError || fieldState.error?.message}
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Cover Image */}
        <FormField
          control={control}
          name="metadata.cover_image"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Cover Image <span className="text-red-500">*</span>
                <div className="text-xs font-normal text-muted-foreground mt-1">
                  Recommended Aspect ratio: 16:9
                </div>
              </FormLabel>
              <div className="space-y-4">
                <AnimatePresence>
                  {coverFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={clearImage}
                      className="relative cursor-pointer group"
                    >
                      <div className="overflow-hidden relative">
                        <img src={coverPreviewUrl!} alt="Cover Image" className="object-cover w-full h-full rounded-lg" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <X className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg p-6 cursor-pointer dark:border-zinc-600"
                    >
                      <Upload className="h-10 w-10 text-zinc-400 mb-2" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "cover_image")}
                        className="hidden"
                      />
                    </motion.label>
                  )}
                </AnimatePresence>
                {(coverError || fieldState.error) && (
                  <div className="text-red-500 text-xs text-center">
                    {coverError || fieldState.error?.message}
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FormStep1;