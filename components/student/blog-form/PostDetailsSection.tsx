'use client';

import MarkdownEditor from '@/components/blog/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProjectDomainEnum } from '@/types/prisma-types';

const CATEGORY_OPTIONS = Object.values(ProjectDomainEnum);

interface PostFields {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
}

interface PostDetailsSectionProps {
  post: PostFields;
  fieldErrors: Record<string, string>;
  onUpdatePost: (key: keyof PostFields, value: string) => void;
  onUploadCover: (file: File) => void;
}

export function PostDetailsSection({ post, fieldErrors, onUpdatePost, onUploadCover }: PostDetailsSectionProps) {
  return (
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
          value={post.title}
          onChange={(e) => onUpdatePost('title', e.target.value)}
        />
        {fieldErrors['post.title'] ? (
          <p className='text-destructive text-xs'>{fieldErrors['post.title']}</p>
        ) : null}
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>Category</Label>
          <select
            value={post.category}
            onChange={(e) => onUpdatePost('category', e.target.value)}
            className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
          >
            <option value=''>Select a category</option>
            {CATEGORY_OPTIONS.map((option) => (
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
              value={post.imageUrl}
              onChange={(e) => onUpdatePost('imageUrl', e.target.value)}
              placeholder='https://...'
            />
            <Input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadCover(file);
              }}
              className='max-w-xs'
            />
          </div>
          {fieldErrors['post.imageUrl'] ? (
            <p className='text-destructive text-xs'>{fieldErrors['post.imageUrl']}</p>
          ) : null}
        </div>
      </div>

      {post.imageUrl ? (
        <img src={post.imageUrl} alt='Blog cover' className='max-h-56 w-full rounded-lg border object-cover' />
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='blog-excerpt'>Excerpt</Label>
        <Textarea
          id='blog-excerpt'
          value={post.excerpt}
          onChange={(e) => onUpdatePost('excerpt', e.target.value)}
          rows={4}
        />
        {fieldErrors['post.excerpt'] ? (
          <p className='text-destructive text-xs'>{fieldErrors['post.excerpt']}</p>
        ) : null}
      </div>

      <div className='space-y-2'>
        <Label>Content</Label>
        <MarkdownEditor
          value={post.content}
          onChange={(value) => onUpdatePost('content', value)}
          placeholder='Write your blog post in Markdown...'
          className='min-h-[360px]'
        />
        {fieldErrors['post.content'] ? (
          <p className='text-destructive text-xs'>{fieldErrors['post.content']}</p>
        ) : null}
      </div>
    </section>
  );
}
