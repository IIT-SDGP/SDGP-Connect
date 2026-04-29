import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import StudentBlogForm from '@/components/student/StudentBlogForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/types/prisma-types';

export const metadata: Metadata = {
  title: 'Edit Blog | Student',
};

export default async function EditStudentBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
        <h1 className='text-3xl font-bold'>Edit Blog Post</h1>
        <p className='text-muted-foreground'>
          Update your draft or rejected post and send it back for review.
        </p>
      </div>

      <StudentBlogForm blogId={id} />
    </div>
  );
}
