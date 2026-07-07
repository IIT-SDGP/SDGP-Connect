'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SOCIAL_FIELDS = ['instagram', 'twitter', 'facebook', 'linkedin', 'medium', 'website'] as const;
type SocialField = (typeof SOCIAL_FIELDS)[number];

interface AuthorFields {
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

interface AuthorSectionProps {
  author: AuthorFields;
  fieldErrors: Record<string, string>;
  onUpdateAuthor: (key: keyof AuthorFields, value: string) => void;
  onUploadAvatar: (file: File) => void;
}

export function AuthorSection({ author, fieldErrors, onUpdateAuthor, onUploadAvatar }: AuthorSectionProps) {
  return (
    <section className='space-y-4 rounded-xl border p-5'>
      <div>
        <h2 className='text-xl font-semibold'>Author Profile</h2>
        <p className='text-muted-foreground text-sm'>
          This is linked to your student account email and will be reused across your posts.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='author-email'>Email</Label>
          <Input id='author-email' value={author.email} readOnly />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='author-name'>Display Name</Label>
          <Input
            id='author-name'
            value={author.name}
            onChange={(e) => onUpdateAuthor('name', e.target.value)}
          />
          {fieldErrors['author.name'] ? (
            <p className='text-destructive text-xs'>{fieldErrors['author.name']}</p>
          ) : null}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex flex-wrap items-start gap-3'>
          <div className='min-w-0 flex-1 space-y-2'>
            <Label htmlFor='author-avatar-url'>Avatar URL</Label>
            <Input
              id='author-avatar-url'
              value={author.avatarUrl}
              onChange={(e) => onUpdateAuthor('avatarUrl', e.target.value)}
              placeholder='https://...'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='author-avatar-file'>Upload Avatar</Label>
            <Input
              id='author-avatar-file'
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadAvatar(file);
              }}
              className='max-w-xs'
            />
          </div>
        </div>
        {author.avatarUrl ? (
          <img src={author.avatarUrl} alt='Author avatar' className='h-16 w-16 rounded-full border object-cover' />
        ) : null}
        {fieldErrors['author.avatarUrl'] ? (
          <p className='text-destructive text-xs'>{fieldErrors['author.avatarUrl']}</p>
        ) : null}
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {SOCIAL_FIELDS.map((field: SocialField) => {
          const inputId = `author-social-${field}`;

          return (
            <div key={field} className='space-y-2'>
              <Label htmlFor={inputId} className='capitalize'>
                {field}
              </Label>
              <Input
                id={inputId}
                value={author[field]}
                onChange={(e) => onUpdateAuthor(field, e.target.value)}
                placeholder={field === 'website' ? 'https://your-site.com' : `Your ${field} link`}
              />
              {fieldErrors[`author.${field}`] ? (
                <p className='text-destructive text-xs'>{fieldErrors[`author.${field}`]}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
