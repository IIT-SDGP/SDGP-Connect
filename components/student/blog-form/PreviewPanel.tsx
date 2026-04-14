'use client';

import MarkdownPreview from '@/components/blog/MarkdownPreview';

interface PostFields {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

interface PreviewPanelProps {
  post: PostFields;
}

export function PreviewPanel({ post }: PreviewPanelProps) {
  return (
    <aside className='space-y-4 rounded-xl border p-5'>
      <div>
        <h2 className='text-xl font-semibold'>Preview</h2>
        <p className='text-muted-foreground text-sm'>
          Check formatting before you submit it for moderation.
        </p>
      </div>

      <div className='space-y-3'>
        <div className='text-2xl font-semibold'>{post.title || 'Untitled draft'}</div>
        <div className='text-muted-foreground text-sm'>
          {post.excerpt || 'Your excerpt will appear here.'}
        </div>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt='Blog preview' className='max-h-56 w-full rounded-lg border object-cover' />
        ) : null}
      </div>

      <div className='rounded-lg border p-4'>
        <MarkdownPreview content={post.content || '*Start writing to preview your post.*'} />
      </div>
    </aside>
  );
}
