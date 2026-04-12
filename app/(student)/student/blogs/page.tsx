import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import StudentBlogsClient from '@/components/student/StudentBlogsClient';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/types/prisma-types';

export const metadata: Metadata = {
  title: 'My Blogs | Student',
};

export default async function StudentBlogsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== Role.STUDENT) {
    redirect('/unauthorized');
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>My Blogs</h1>
          <p className='text-muted-foreground'>
            Create, revise, and track the moderation state of your blog submissions.
          </p>
        </div>
        <Button asChild>
          <Link href='/student/blogs/new'>New Blog</Link>
        </Button>
      </div>

      <StudentBlogsClient />
    </div>
  );
}
