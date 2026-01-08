// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, User, FileText, Edit, CheckCircle, Upload, X, Newspaper, User2, Rocket } from "lucide-react";
import React from "react";
import { ProjectDomainEnum } from "@/types/prisma-types";
import { useCheckAuthor } from "@/hooks/blogs/useCheckAuthor";
import { useCreateAuthor } from "@/hooks/blogs/useCreateAuthor";
import { useCreateBlog } from "@/hooks/blogs/useCreateBlog";
import useUploadImageToBlob from "@/hooks/azure/useUploadImageToBlob";
import { BlogFormData } from "@/types/blog";
import { blogAuthorSchema, blogPostSchema } from "@/validations/blog";
import MarkdownPreview from "@/components/blog/MarkdownPreview";
import MarkdownEditor from "@/components/blog/MarkdownEditor";
import { useRouter } from "next/navigation";

// Convert ProjectDomainEnum to array for dropdown
const ProjectDomainEnumArray = Object.values(ProjectDomainEnum);

export default function BlogCreatePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();const [formData, setFormData] = useState<BlogFormData>({
    author: {
      email: "",
      name: "",
      avatarUrl: "",
      instagram: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      medium: "",
      website: "",
      found: false,
      verified: false, // Add verification status
    },    meta: {
      title: "",
      excerpt: "",
      category: "",
      imageUrl: "",
    },
    content: "",
    featured: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Hooks
  const { checkAuthor, author: foundAuthor, isLoading: checkingAuthor, error: hookError } = useCheckAuthor();
  const { createAuthor, isLoading: creatingAuthor } = useCreateAuthor();
  const { createBlog, isLoading: creatingBlog, success, error: submitError } = useCreateBlog();
  const { uploadImage, isLoading: uploadingImage } = useUploadImageToBlob();

  // Auto redirect to blogs page after successful submission
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/blog');
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [success, router]);
  // Helper functions
  const updateAuthor = (updates: Partial<BlogFormData['author']>) => {
    setFormData(prev => ({
      ...prev,
      author: { ...prev.author, ...updates }
    }));
  };

  const updateMeta = (updates: Partial<BlogFormData['meta']>) => {
    setFormData(prev => ({
      ...prev,
      meta: { ...prev.meta, ...updates }
    }));
  };
  const updateContent = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Image upload handlers
  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, setUploadProgress);
      updateMeta({ imageUrl: url });
    } catch (error) {
      setErrors(prev => ({ ...prev, imageUrl: "Failed to upload image" }));
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, setUploadProgress);
      updateAuthor({ avatarUrl: url });
    } catch (error) {
      setErrors(prev => ({ ...prev, avatarUrl: "Failed to upload avatar" }));
    }
  };  // Step 1: Author Email Verification
  const handleEmailVerification = async () => {
    setErrors({}); // Clear any previous errors
    // Validate email format first
    try {
      blogAuthorSchema.pick({ email: true }).parse({ email: formData.author.email });
    } catch (error: any) {
      setErrors({ authorEmail: "Please enter a valid email address" });
      return;
    }
    try {
      const author = await checkAuthor(formData.author.email);
      if (author) {
        updateAuthor({
          name: author.name,
          avatarUrl: author.avatarUrl || "",
          instagram: author.instagram || "",
          twitter: author.twitter || "",
          facebook: author.facebook || "",
          linkedin: author.linkedin || "",
          medium: author.medium || "",
          website: author.website || "",
          found: true,
          verified: true,
        });
      } else if (!hookError) {
        // Not found, but no error (404)
        updateAuthor({ 
          found: false, 
          verified: true,
          // Reset other fields when creating new author
          name: "",
          avatarUrl: "",
          instagram: "",
          twitter: "",
          facebook: "",
          linkedin: "",
          medium: "",
          website: "",
        });
      } else if (hookError) {
        setErrors({ authorEmail: hookError });
      }
    } catch (e) {
      setErrors({ authorEmail: hookError || "Failed to verify email. Please try again." });
    }
  };

  const handleAuthorRegister = async () => {
    setErrors({});
    // Validate author data
    const result = blogAuthorSchema.safeParse(formData.author);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors?.forEach((err: any) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    if (!formData.author.name) {
      setErrors({ authorName: "Name is required" });
      return;
    }    // Create author and update state with id
    try {
      const authorData = {
        email: formData.author.email,
        name: formData.author.name,
        instagram: formData.author.instagram || "",
        twitter: formData.author.twitter || "",
        facebook: formData.author.facebook || "",
        linkedin: formData.author.linkedin || "",
        medium: formData.author.medium || "",
        website: formData.author.website || "",
        avatarUrl: formData.author.avatarUrl || "",
      };
      const created = await createAuthor(authorData);
      if (created && created.id) {
        updateAuthor({ found: true, verified: true, ...created });
        setStep(1);
      } else {
        setErrors({ submit: "Failed to create author. Please try again." });
      }
    } catch (e: any) {
      setErrors({ submit: e?.message || "Failed to create author. Please try again." });
    }
  };

  // Check if all required author fields are filled and valid
  const isAuthorFormComplete = () => {
    if (formData.author.found) {
      return true; // If author exists, we're good to go
    }
    // If new author, check required fields and validation
    const result = blogAuthorSchema.safeParse(formData.author);
    return result.success;
  };

  // Step 2: Metadata
  const handleMetaContinue = () => {
    setErrors({});
    
    // Validate metadata
    const newErrors: Record<string, string> = {};
    if (!formData.meta.title) newErrors.title = "Title is required";
    if (!formData.meta.category) newErrors.category = "Category is required";
    if (!formData.meta.excerpt) newErrors.excerpt = "Excerpt is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStep(2);
  };

  // Step 3: Content
  const handleContentContinue = () => {
    setErrors({});
    
    if (!formData.content) {
      setErrors({ content: "Content is required" });
      return;
    }
    
    setStep(3);
  };

  // Step 4: Submit
  const handleSubmit = async () => {
    setErrors({});
    
    try {
      // Validate all data
      const submissionData = {
        author: {
          name: formData.author.name,
          email: formData.author.email,
          avatarUrl: formData.author.avatarUrl || "",
          instagram: formData.author.instagram || "",
          twitter: formData.author.twitter || "",
          facebook: formData.author.facebook || "",
          linkedin: formData.author.linkedin || "",
          medium: formData.author.medium || "",
          website: formData.author.website || "",
        },        post: {
          title: formData.meta.title,
          excerpt: formData.meta.excerpt,
          content: formData.content,
          imageUrl: formData.meta.imageUrl || "",
          category: formData.meta.category as any, // Type cast for enum
          featured: false, // Always false, admin will feature later
        },
      };

      await createBlog(submissionData);
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to submit blog post" });
    }
  };
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Side illustration panel - only visible on large screens */}
      <div className="hidden w-1/2 bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-8">
            {/* Header removed for cleaner look */}
          </div>
          <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
            {step === 2 ? (
              <div className="w-full h-full overflow-auto">
                <div className="font-semibold mb-2">Live Preview</div>
                <div className="border rounded-md bg-background p-4 min-h-[300px] max-h-[600px] overflow-auto">
                  <MarkdownPreview content={formData.content} />
                </div>
              </div>
            ) : (
              <>
                {step === 0 && ((
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/15"></div>
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-primary/10"></div>
            <div className="relative grid h-64 w-64 grid-cols-2 gap-4 rounded-xl bg-primary/5 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-lg bg-background p-4 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex justify-center items-center"><User2 className="text-white/30" /></div>
                  <div className="mt-2 h-2 w-12 rounded bg-muted"></div>
                  <div className="mt-1 h-2 w-8 rounded bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
                {step === 1 && (
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-primary/10"></div>
            <div className="absolute -right-6 bottom-6 h-16 w-16 rounded-full bg-primary/20"></div>
            <div className="relative flex h-64 w-64 flex-col rounded-xl bg-primary/5 p-6">
              <Newspaper className="h-10 w-10 text-primary" />
              <div className="mt-4 h-4 w-2/3 rounded bg-primary/20"></div>
              <div className="mt-6 flex-1 rounded-lg bg-background p-4">
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-muted"></div>
                  <div className="h-2 w-5/6 rounded bg-muted"></div>
                  <div className="h-2 w-4/6 rounded bg-muted"></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-8 rounded bg-muted"></div>
                  <div className="h-8 rounded bg-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
                {step === 3 && (
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            <div className="absolute -left-16 -top-16 h-32 w-32 animate-pulse rounded-full bg-primary/10"></div>
            <div className="absolute -bottom-8 -right-8 h-24 w-24 animate-pulse rounded-full bg-primary/20"></div>
            <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-xl bg-primary/5 p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Rocket className="h-12 w-12 text-primary" />
              </div>
              <div className="mt-6 text-center">
                <div className="mx-auto h-5 w-32 rounded bg-primary/20"></div>
                <div className="mx-auto mt-2 h-4 w-48 rounded bg-primary/15"></div>
                <div className="mx-auto mt-4 h-10 w-32 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
        </div>
      )}
              </>
            )}
          </div>
        </div>
      </div>      {/* Content panel */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex h-16 items-center border-b px-4 sm:px-6">
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-8 sm:w-12 rounded-full",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <div className="ml-auto text-xs sm:text-sm text-muted-foreground">
            Step {step + 1} of 4
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-12">{/* Step content */}          {step === 0 && (            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-bold">Identify the Author</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Enter your email to get started</p><div className="space-y-4">
                <Label htmlFor="author-email">Email</Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">                  <Input
                    id="author-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.author.email}
                    onChange={(e) => updateAuthor({ 
                      email: e.target.value, 
                      verified: false,
                      found: false,
                      // Reset author fields when email changes
                      name: "",
                      avatarUrl: "",
                      instagram: "",
                      twitter: "",
                      facebook: "",
                      linkedin: "",
                      medium: "",
                      website: "",
                    })}
                    disabled={formData.author.verified}
                    className="flex-1"
                  />                  {!formData.author.verified ? (
                    <Button 
                      onClick={handleEmailVerification} 
                      disabled={checkingAuthor || !formData.author.email}
                      className="w-full sm:w-auto"
                    >
                      {checkingAuthor ? "Verifying..." : "Verify"}
                    </Button>) : (
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
                      <Button variant="secondary" disabled className="w-full sm:w-auto">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verified
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => updateAuthor({ 
                          email: "",
                          verified: false, 
                          found: false,
                          name: "",
                          avatarUrl: "",
                          instagram: "",
                          twitter: "",
                          facebook: "",
                          linkedin: "",
                          medium: "",
                          website: "",
                        })}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                {errors.authorEmail && (
                  <p className="text-sm text-red-500">{errors.authorEmail}</p>
                )}
                {hookError && !errors.authorEmail && (
                  <p className="text-sm text-red-500">{hookError}</p>
                )}
              </div>

              {/* Show verification result */}
              {formData.author.verified && formData.author.found && foundAuthor && (
                <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-green-800 font-medium">Author Found!</p>
                      <p className="text-green-600 text-sm">We found your existing author profile.</p>
                    </div>
                  </div>                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {foundAuthor.avatarUrl && (
                      <img
                        src={foundAuthor.avatarUrl}
                        alt="avatar"
                        className="h-12 w-12 rounded-full border"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-black">{foundAuthor.name}</div>
                      <div className="text-sm text-gray-900 break-all">{foundAuthor.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {formData.author.verified && !formData.author.found && (
                <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium">Author Not Found</p>
                      <p className="text-blue-600 text-sm">Please create your author profile below.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Author registration form - only show if verified and not found */}
              {formData.author.verified && !formData.author.found && (                <div className="mt-6 space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Create Author Profile</h2>
                  
                  <Label htmlFor="author-name">Name *</Label>
                  <Input
                    id="author-name"
                    placeholder="Your Name"
                    value={formData.author.name}
                    onChange={(e) => updateAuthor({ name: e.target.value })}
                  />
                  {errors.authorName && (
                    <p className="text-sm text-red-500">{errors.authorName}</p>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                    <Label htmlFor="author-avatar">Avatar Image (optional)</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:gap-0">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          handleAvatarUpload(file);
                        }
                      }}
                      disabled={uploadingImage}
                      className="w-full sm:flex-1"
                    />
                    {uploadingImage && <p className="text-sm w-full sm:w-auto">Uploading... {uploadProgress}%</p>}
                  </div>
                  {formData.author.avatarUrl && (
                    <img src={formData.author.avatarUrl} alt="Avatar preview" className="h-16 w-16 rounded-full" />
                  )}
                  
                  <Label htmlFor="author-instagram">Instagram (optional)</Label>
                  <Input
                    id="author-instagram"
                    placeholder="Instagram URL or @handle"
                    value={formData.author.instagram}
                    onChange={(e) => updateAuthor({ instagram: e.target.value })}
                  />
                  {errors.instagram && (
                    <p className="text-sm text-red-500">{errors.instagram}</p>
                  )}
                  <Label htmlFor="author-twitter">Twitter (optional)</Label>
                  <Input
                    id="author-twitter"
                    placeholder="Twitter URL or @handle"
                    value={formData.author.twitter}
                    onChange={(e) => updateAuthor({ twitter: e.target.value })}
                  />
                  {errors.twitter && (
                    <p className="text-sm text-red-500">{errors.twitter}</p>
                  )}
                  <Label htmlFor="author-facebook">Facebook (optional)</Label>
                  <Input
                    id="author-facebook"
                    placeholder="Facebook URL or @handle"
                    value={formData.author.facebook}
                    onChange={(e) => updateAuthor({ facebook: e.target.value })}
                  />
                  {errors.facebook && (
                    <p className="text-sm text-red-500">{errors.facebook}</p>
                  )}
                  <Label htmlFor="author-linkedin">LinkedIn (optional)</Label>
                  <Input
                    id="author-linkedin"
                    placeholder="LinkedIn URL or @handle"
                    value={formData.author.linkedin}
                    onChange={(e) => updateAuthor({ linkedin: e.target.value })}
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-red-500">{errors.linkedin}</p>
                  )}
                  <Label htmlFor="author-medium">Medium (optional)</Label>
                  <Input
                    id="author-medium"
                    placeholder="Medium URL or @handle"
                    value={formData.author.medium}
                    onChange={(e) => updateAuthor({ medium: e.target.value })}
                  />
                  {errors.medium && (
                    <p className="text-sm text-red-500">{errors.medium}</p>
                  )}
                  <Label htmlFor="author-website">Website (optional)</Label>
                  <Input
                    id="author-website"
                    placeholder="https://yourwebsite.com"
                    value={formData.author.website}
                    onChange={(e) => updateAuthor({ website: e.target.value })}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500">{errors.website}</p>
                  )}
                </div>
              )}
            </div>
          )}{step === 1 && (            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-bold">Blog Metadata</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Fill in the details for your blog post</p>
              <div className="space-y-4">
                <Label htmlFor="blog-title">Title *</Label>
                <Input
                  id="blog-title"
                  placeholder="Blog Title"
                  value={formData.meta.title}
                  onChange={(e) => updateMeta({ title: e.target.value })}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                
                <Label htmlFor="blog-excerpt">Excerpt *</Label>
                <Textarea
                  id="blog-excerpt"
                  placeholder="Short summary of your blog"
                  value={formData.meta.excerpt}
                  onChange={(e) => updateMeta({ excerpt: e.target.value })}
                  className="min-h-20"
                />
                {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                
                <Label htmlFor="blog-category">Category *</Label>
                <select
                  id="blog-category"
                  title="Blog Category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.meta.category}
                  onChange={(e) => updateMeta({ category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {ProjectDomainEnumArray.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  <Label htmlFor="blog-image">Feature Image</Label>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:gap-0">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploadingImage}
                      className="w-full sm:flex-1"
                    />
                    {uploadingImage && <p className="text-sm w-full sm:w-auto">Uploading... {uploadProgress}%</p>}
                  </div>
                  {formData.meta.imageUrl && (                    <img src={formData.meta.imageUrl} alt="Feature image preview" className="h-32 w-full sm:w-auto rounded object-cover" />
                  )}
                </div>
              </div>
            </div>
          )}{step === 2 && (            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-bold">Write Your Blog</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Write your content below using the formatting toolbar</p>
              <div className="space-y-2">                <Label htmlFor="blog-content">Content (Markdown supported) *</Label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={updateContent}
                  placeholder="Write your blog content here... Use the toolbar above for formatting."
                  className="min-h-[250px] sm:min-h-[300px]"
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>
            </div>
          )}{step === 3 && (            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-bold">Review & Submit</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Review your blog post before submitting</p>
                {success && (
                <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 font-medium">Blog post submitted successfully!</p>
                  </div>
                  <p className="text-green-600 text-sm mt-2">Your blog post has been submitted for review and will be published after approval.</p>
                  <p className="text-green-600 text-sm mt-1">Redirecting to blogs page in 3 seconds...</p>
                </div>
              )}
              
              {submitError && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                  <p className="text-red-800 font-medium">Submission failed</p>
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}
              
              {errors.submit && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
                <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:space-x-4 sm:gap-0">
                  {(formData.author.avatarUrl || foundAuthor?.avatarUrl) && (
                    <img 
                      src={formData.author.avatarUrl || foundAuthor?.avatarUrl || ""} 
                      alt="avatar" 
                      className="h-12 w-12 rounded-full border" 
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{formData.author.name || foundAuthor?.name || "(No name)"}</div>
                    <div className="text-sm text-muted-foreground break-all">{formData.author.email}</div>
                    {formData.author.website && (
                      <div className="text-sm text-muted-foreground break-all">Website: {formData.author.website}</div>
                    )}
                  </div>
                </div>
                  <div>
                  <div className="font-semibold">Title:</div>
                  <div className="break-words">{formData.meta.title}</div>
                </div>
                
                <div>
                  <div className="font-semibold">Excerpt:</div>
                  <div className="break-words">{formData.meta.excerpt}</div>
                </div>
                
                <div>
                  <div className="font-semibold">Category:</div>
                  <div className="break-words">{formData.meta.category.replace(/_/g, ' ')}</div>
                </div>
                  <div>
                  <div className="font-semibold">Feature Image:</div>
                  {formData.meta.imageUrl && (
                    <img src={formData.meta.imageUrl} alt="feature" className="h-24 w-full sm:w-auto rounded mt-2 object-cover" />
                  )}                </div>
                <div>
                  <div className="font-semibold">Content:</div>
                  <div className="border rounded p-2 bg-background mt-2 max-h-40 overflow-y-auto">
                    <MarkdownPreview content={formData.content} />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full mt-4"
                  disabled={creatingBlog || success}
                >
                  {creatingBlog ? "Submitting..." : success ? "Submitted!" : "Submit for review"}
                </Button>
              </div>
            </div>
          )}          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-6">
            {/* Remove Back button on first step or when successful */}
            {step > 0 && !success && (
              <Button
                variant="outline"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                className="flex items-center w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            
            {/* Step 0: Only show Next button if email is verified */}
            {step === 0 && formData.author.verified && (
              <Button
                onClick={() => {
                  if (formData.author.found) {
                    setStep(1); // Go directly to metadata if author exists
                  } else {
                    handleAuthorRegister(); // Create author and proceed
                  }
                }}
                className="flex items-center w-full sm:w-auto sm:ml-auto"
                disabled={!isAuthorFormComplete() || creatingAuthor || uploadingImage}
              >
                {creatingAuthor ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Creating...
                  </>
                ) : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {/* Steps 1-2: Regular Next button */}
            {step > 0 && step < 3 && (
              <Button
                onClick={() => {
                  if (step === 1) {
                    handleMetaContinue();
                  } else if (step === 2) {
                    handleContentContinue();
                  }
                }}
                className="flex items-center w-full sm:w-auto sm:ml-auto"
                disabled={uploadingImage}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
