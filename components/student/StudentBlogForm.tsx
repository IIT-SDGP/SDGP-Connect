'use client';

import { ProjectDomainEnum } from '@/types/prisma-types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import MarkdownEditor from '@/components/blog/MarkdownEditor';
import MarkdownPreview from '@/components/blog/MarkdownPreview';
import { BlogStatusBadge } from '@/components/student/status-badges';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import useUploadImageToBlob from '@/hooks/azure/useUploadImageToBlob';
import { blogSubmissionSchema } from '@/validations/blog';

type StudentBlogFormProps = {
  blogId?: string;
};

type BlogPayload = {
  author: {
    name: string;
    email: string;
    avatarUrl: string;
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    medium: string;
    website: string;
  };
  post: {
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
  };
  approved?: boolean;
  rejectedById?: string | null;
  rejectedReason?: string | null;
};

const categoryOptions = Object.values(ProjectDomainEnum);

const emptyPayload = (email = '', name = ''): BlogPayload => ({
  author: {
    name,
    email,
    avatarUrl: '',
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    medium: '',
    website: '',
  },
  post: {
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: '',
  },
});

function mapZodErrors(error: any) {
  const result: Record<string, string> = {};

  for (const issue of error?.errors ?? []) {
    const key = Array.isArray(issue.path) ? issue.path.join('.') : issue.path;
    if (key) {
      result[key] = issue.message;
    }
  }

  return result;
}

export default function StudentBlogForm({ blogId }: StudentBlogFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { uploadImage } = useUploadImageToBlob();

  const [formData, setFormData] = useState<BlogPayload>(emptyPayload());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const previewStatus = useMemo(
    () => ({
      approved: !!formData.approved,
      rejectedById: formData.rejectedById,
    }),
    [formData.approved, formData.rejectedById]
  );

  useEffect(() => {
    const load = async () => {
      if (status !== "authenticated") return;

      const sessionEmail = session.user.email ?? '';
      const sessionName = session.user.name ?? '';

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (blogId) {
          const response = await fetch(`/api/student/blogs/${blogId}`);
          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload?.error || 'Failed to load blog post');
          }

          const blog = payload.data;
          setFormData({
            author: {
              name: blog.author?.name ?? sessionName,
              email: blog.author?.email ?? sessionEmail,
              avatarUrl: blog.author?.avatarUrl ?? '',
              instagram: blog.author?.instagram ?? '',
              twitter: blog.author?.twitter ?? '',
              facebook: blog.author?.facebook ?? '',
              linkedin: blog.author?.linkedin ?? '',
              medium: blog.author?.medium ?? '',
              website: blog.author?.website ?? '',
            },
            post: {
              title: blog.title ?? '',
              excerpt: blog.excerpt ?? '',
              content: blog.content ?? '',
              imageUrl: blog.imageUrl ?? '',
              category: blog.category ?? '',
            },
            approved: blog.approved ?? false,
            rejectedById: blog.rejectedById ?? null,
            rejectedReason: blog.rejectedReason ?? null,
          });
        } else {
          const nextPayload = emptyPayload(sessionEmail, sessionName);

          if (sessionEmail) {
            const response = await fetch('/api/blogs/author/check', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: sessionEmail }),
            });

            if (response.ok) {
              const author = await response.json();
              nextPayload.author = {
                name: author.name ?? sessionName,
                email: author.email ?? sessionEmail,
                avatarUrl: author.avatarUrl ?? '',
                instagram: author.instagram ?? '',
                twitter: author.twitter ?? '',
                facebook: author.facebook ?? '',
                linkedin: author.linkedin ?? '',
                medium: author.medium ?? '',
                website: author.website ?? '',
              };
            }
          }

          setFormData(nextPayload);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load blog form');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [blogId, session?.user.email, session?.user.name, status]);

  const updateAuthor = (key: keyof BlogPayload['author'], value: string) => {
    setFormData((current) => ({
      ...current,
      author: {
        ...current.author,
        [key]: value,
      },
    }));
  };

  const updatePost = (key: keyof BlogPayload['post'], value: string) => {
    setFormData((current) => ({
      ...current,
      post: {
        ...current.post,
        [key]: value,
      },
    }));
  };

  const handleUpload = async (kind: 'avatarUrl' | 'imageUrl', file: File) => {
    try {
      const url = await uploadImage(file);

      if (kind === 'avatarUrl') {
        updateAuthor('avatarUrl', url);
      } else {
        updatePost('imageUrl', url);
      }

      toast.success('Image uploaded');
    } catch (error) {
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
        post: {
          ...formData.post,
          category: formData.post.category as ProjectDomainEnum,
          featured: false,
        },
      };

      const validation = blogSubmissionSchema.safeParse(payload);
      if (!validation.success) {
        setFieldErrors(mapZodErrors(validation.error));
        setIsSaving(false);
        return;
      }

      const response = await fetch(blogId ? `/api/student/blogs/${blogId}` : '/api/student/blogs', {
        method: blogId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to save blog post');
      }

      toast.success(blogId ? 'Blog post updated' : 'Blog post created');
      router.push('/student/blogs');
      router.refresh();
    } catch (error) {
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
          <section className='space-y-4 rounded-xl border p-5'>
            <div>
              <h2 className='text-xl font-semibold'>Author Profile</h2>
              <p className='text-muted-foreground text-sm'>
                This is linked to your student account email and will be reused across your posts.
              </p>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value={formData.author.email} readOnly />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='author-name'>Display Name</Label>
                <Input
                  id='author-name'
                  value={formData.author.name}
                  onChange={(event) => updateAuthor('name', event.target.value)}
                />
                {fieldErrors['author.name'] ? (
                  <p className='text-destructive text-xs'>{fieldErrors['author.name']}</p>
                ) : null}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Avatar</Label>
              <div className='flex flex-wrap items-center gap-3'>
                <Input
                  value={formData.author.avatarUrl}
                  onChange={(event) => updateAuthor('avatarUrl', event.target.value)}
                  placeholder='https://...'
                />
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleUpload('avatarUrl', file);
                  }}
                  className='max-w-xs'
                />
              </div>
              {formData.author.avatarUrl ? (
                <img
                  src={formData.author.avatarUrl}
                  alt='Author avatar'
                  className='h-16 w-16 rounded-full border object-cover'
                />
              ) : null}
              {fieldErrors['author.avatarUrl'] ? (
                <p className='text-destructive text-xs'>{fieldErrors['author.avatarUrl']}</p>
              ) : null}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              {(['instagram', 'twitter', 'facebook', 'linkedin', 'medium', 'website'] as const).map((field) => (
                <div key={field} className='space-y-2'>
                  <Label className='capitalize'>{field}</Label>
                  <Input
                    value={formData.author[field]}
                    onChange={(event) => updateAuthor(field, event.target.value)}
                    placeholder={field === 'website' ? 'https://your-site.com' : `Your ${field} link`}
                  />
                  {fieldErrors[`author.${field}`] ? (
                    <p className='text-destructive text-xs'>{fieldErrors[`author.${field}`]}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-4 rounded-xl border p-5'>
            <div>
              <h2 className='text-xl font-semibold'>Post Details</h2>
              <p className='text-muted-foreground text-sm'>
                Rejected edits will be resubmitted for moderation automatically.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='blog-title'>Title</Label>
              <Input
                id='blog-title'
                value={formData.post.title}
                onChange={(event) => updatePost('title', event.target.value)}
              />
              {fieldErrors['post.title'] ? (
                <p className='text-destructive text-xs'>{fieldErrors['post.title']}</p>
              ) : null}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Category</Label>
                <select
                  value={formData.post.category}
                  onChange={(event) => updatePost('category', event.target.value)}
                  className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                >
                  <option value=''>Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {fieldErrors['post.category'] ? (
                  <p className='text-destructive text-xs'>{fieldErrors['post.category']}</p>
                ) : null}
              </div>

              <div className='space-y-2'>
                <Label>Cover Image</Label>
                <div className='flex flex-wrap items-center gap-3'>
                  <Input
                    value={formData.post.imageUrl}
                    onChange={(event) => updatePost('imageUrl', event.target.value)}
                    placeholder='https://...'
                  />
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleUpload('imageUrl', file);
                    }}
                    className='max-w-xs'
                  />
                </div>
                {fieldErrors['post.imageUrl'] ? (
                  <p className='text-destructive text-xs'>{fieldErrors['post.imageUrl']}</p>
                ) : null}
              </div>
            </div>

            {formData.post.imageUrl ? (
              <img
                src={formData.post.imageUrl}
                alt='Blog cover'
                className='max-h-56 w-full rounded-lg border object-cover'
              />
            ) : null}

            <div className='space-y-2'>
              <Label htmlFor='blog-excerpt'>Excerpt</Label>
              <Textarea
                id='blog-excerpt'
                value={formData.post.excerpt}
                onChange={(event) => updatePost('excerpt', event.target.value)}
                rows={4}
              />
              {fieldErrors['post.excerpt'] ? (
                <p className='text-destructive text-xs'>{fieldErrors['post.excerpt']}</p>
              ) : null}
            </div>

            <div className='space-y-2'>
              <Label>Content</Label>
              <MarkdownEditor
                value={formData.post.content}
                onChange={(value) => updatePost('content', value)}
                placeholder='Write your blog post in Markdown...'
                className='min-h-[360px]'
              />
              {fieldErrors['post.content'] ? (
                <p className='text-destructive text-xs'>{fieldErrors['post.content']}</p>
              ) : null}
            </div>
          </section>

          <div className='flex flex-wrap gap-3'>
            <Button onClick={() => void handleSubmit()} disabled={isSaving}>
              {isSaving ? 'Saving...' : blogId ? 'Save Changes' : 'Create Blog Post'}
            </Button>
            <Button variant='outline' asChild>
              <Link href='/student/blogs'>Cancel</Link>
            </Button>
          </div>
        </div>

        <aside className='space-y-4 rounded-xl border p-5'>
          <div>
            <h2 className='text-xl font-semibold'>Preview</h2>
            <p className='text-muted-foreground text-sm'>
              Check formatting before you submit it for moderation.
            </p>
          </div>

          <div className='space-y-3'>
            <div className='text-2xl font-semibold'>
              {formData.post.title || 'Untitled draft'}
            </div>
            <div className='text-muted-foreground text-sm'>
              {formData.post.excerpt || 'Your excerpt will appear here.'}
            </div>
            {formData.post.imageUrl ? (
              <img
                src={formData.post.imageUrl}
                alt='Blog preview'
                className='max-h-56 w-full rounded-lg border object-cover'
              />
            ) : null}
          </div>

          <div className='rounded-lg border p-4'>
            <MarkdownPreview content={formData.post.content || '*Start writing to preview your post.*'} />
          </div>
        </aside>
      </div>
    </div>
  );
}
