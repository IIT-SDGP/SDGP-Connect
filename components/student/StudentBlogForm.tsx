'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BlogStatusBadge } from '@/components/student/status-badges';
import { AuthorSection } from '@/components/student/blog-form/AuthorSection';
import { PostDetailsSection } from '@/components/student/blog-form/PostDetailsSection';
import { PreviewPanel } from '@/components/student/blog-form/PreviewPanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useUploadImageToBlob from '@/hooks/azure/useUploadImageToBlob';
import { ProjectDomainEnum } from '@/types/prisma-types';
import { blogSubmissionSchema } from '@/validations/blog';

interface StudentBlogFormProps {
  blogId?: string;
}

interface BlogAuthorFields {
  name: string;
  email: string;
  avatarUrl: string;
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  medium: string;
  website: string;
}

interface BlogPostFields {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
}

interface BlogFormState {
  author: BlogAuthorFields;
  post: BlogPostFields;
  approved?: boolean;
  rejectedById?: string | null;
  rejectedReason?: string | null;
}

function emptyState(email = '', name = ''): BlogFormState {
  return {
    author: { name, email, avatarUrl: '', instagram: '', twitter: '', facebook: '', linkedin: '', medium: '', website: '' },
    post: { title: '', excerpt: '', content: '', imageUrl: '', category: '' },
  };
}

function mapZodErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  const issues = (error as { errors?: Array<{ path: string[]; message: string }> })?.errors ?? [];

  for (const issue of issues) {
    const key = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path);
    if (key) result[key] = issue.message;
  }

  return result;
}

export default function StudentBlogForm({ blogId }: StudentBlogFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { uploadImage } = useUploadImageToBlob();

  const [formData, setFormData] = useState<BlogFormState>(emptyState());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const previewStatus = useMemo(
    () => ({ approved: !!formData.approved, rejectedById: formData.rejectedById }),
    [formData.approved, formData.rejectedById]
  );

  useEffect(() => {
    const load = async () => {
      if (status !== 'authenticated') return;

      const sessionEmail = session.user.email ?? '';
      const sessionName = session.user.name ?? '';

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (blogId) {
          const response = await fetch(`/api/student/blogs/${blogId}`);
          const payload = await response.json() as { data?: Record<string, unknown>; error?: string };

          if (!response.ok) throw new Error(payload?.error ?? 'Failed to load blog post');

          const blog = payload.data as Record<string, unknown> & { author?: Record<string, unknown> };

          if (blog.approved) {
            toast.info('Approved posts cannot be edited.');
            router.replace('/student/blogs');
            return;
          }

          setFormData({
            author: {
              name: String(blog.author?.name ?? sessionName),
              email: String(blog.author?.email ?? sessionEmail),
              avatarUrl: String(blog.author?.avatarUrl ?? ''),
              instagram: String(blog.author?.instagram ?? ''),
              twitter: String(blog.author?.twitter ?? ''),
              facebook: String(blog.author?.facebook ?? ''),
              linkedin: String(blog.author?.linkedin ?? ''),
              medium: String(blog.author?.medium ?? ''),
              website: String(blog.author?.website ?? ''),
            },
            post: {
              title: String(blog.title ?? ''),
              excerpt: String(blog.excerpt ?? ''),
              content: String(blog.content ?? ''),
              imageUrl: String(blog.imageUrl ?? ''),
              category: String(blog.category ?? ''),
            },
            approved: Boolean(blog.approved),
            rejectedById: (blog.rejectedById as string | null) ?? null,
            rejectedReason: (blog.rejectedReason as string | null) ?? null,
          });
        } else {
          const next = emptyState(sessionEmail, sessionName);

          if (sessionEmail) {
            const response = await fetch('/api/blogs/author/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: sessionEmail }),
            });

            if (response.ok) {
              const author = await response.json() as Record<string, unknown>;
              next.author = {
                name: String(author.name ?? sessionName),
                email: String(author.email ?? sessionEmail),
                avatarUrl: String(author.avatarUrl ?? ''),
                instagram: String(author.instagram ?? ''),
                twitter: String(author.twitter ?? ''),
                facebook: String(author.facebook ?? ''),
                linkedin: String(author.linkedin ?? ''),
                medium: String(author.medium ?? ''),
                website: String(author.website ?? ''),
              };
            }
          }

          setFormData(next);
        }
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load blog form');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [blogId, router, session?.user.email, session?.user.name, status]);

  const updateAuthor = (key: keyof BlogAuthorFields, value: string) => {
    setFormData((prev) => ({ ...prev, author: { ...prev.author, [key]: value } }));
  };

  const updatePost = (key: keyof BlogPostFields, value: string) => {
    setFormData((prev) => ({ ...prev, post: { ...prev.post, [key]: value } }));
  };

  const handleUpload = async (kind: 'avatarUrl' | 'imageUrl', file: File) => {
    try {
      const url = await uploadImage(file);
      if (kind === 'avatarUrl') updateAuthor('avatarUrl', url);
      else updatePost('imageUrl', url);
      toast.success('Image uploaded');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const payload = {
        author: formData.author,
        post: { ...formData.post, category: formData.post.category as ProjectDomainEnum, featured: false },
      };

      const validation = blogSubmissionSchema.safeParse(payload);
      if (!validation.success) {
        setFieldErrors(mapZodErrors(validation.error));
        return;
      }

      const response = await fetch(
        blogId ? `/api/student/blogs/${blogId}` : '/api/student/blogs',
        {
          method: blogId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result?.error ?? 'Failed to save blog post');

      toast.success(blogId ? 'Blog post updated' : 'Blog post created');
      router.push('/student/blogs');
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-80 w-full' />
      </div>
    );
  }

  if (errorMessage && !formData.author.email && !blogId) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {blogId ? (
        <div className='flex items-center gap-3'>
          <BlogStatusBadge {...previewStatus} />
          {formData.rejectedReason ? (
            <p className='text-destructive text-sm'>Reason: {formData.rejectedReason}</p>
          ) : null}
        </div>
      ) : null}

      {errorMessage ? (
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-6'>
          <AuthorSection
            author={formData.author}
            fieldErrors={fieldErrors}
            onUpdateAuthor={updateAuthor}
            onUploadAvatar={(file) => void handleUpload('avatarUrl', file)}
          />
          <PostDetailsSection
            post={formData.post}
            fieldErrors={fieldErrors}
            onUpdatePost={updatePost}
            onUploadCover={(file) => void handleUpload('imageUrl', file)}
          />
          <div className='flex flex-wrap gap-3'>
            <Button onClick={() => void handleSubmit()} disabled={isSaving}>
              {isSaving ? 'Saving...' : blogId ? 'Save Changes' : 'Create Blog Post'}
            </Button>
            <Button variant='outline' asChild>
              <Link href='/student/blogs'>Cancel</Link>
            </Button>
          </div>
        </div>
        <PreviewPanel post={formData.post} />
      </div>
    </div>
  );
}
