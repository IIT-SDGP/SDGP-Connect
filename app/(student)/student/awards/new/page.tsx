import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import StudentAwardForm from '@/components/student/StudentAwardForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/types/prisma-types';

export const metadata: Metadata = {
  title: 'New Award | Student',
};

export default async function NewStudentAwardPage() {
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
        <h1 className='text-3xl font-bold'>Create Award Submission</h1>
        <p className='text-muted-foreground'>
          Attach a new award to one of your projects and submit it for review.
        </p>
      </div>

      <StudentAwardForm />
    </div>
  );
}
