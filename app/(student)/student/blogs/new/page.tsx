import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import StudentBlogForm from '@/components/student/StudentBlogForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/types/prisma-types';

export const metadata: Metadata = {
  title: 'New Blog | Student',
};

export default async function NewStudentBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== Role.STUDENT) {
    redirect('/unauthorized');
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Create Blog Post</h1>
        <p className='text-muted-foreground'>
          Draft a new post and submit it for moderation from inside the student dashboard.
        </p>
      </div>

      <StudentBlogForm />
    </div>
  );
}
