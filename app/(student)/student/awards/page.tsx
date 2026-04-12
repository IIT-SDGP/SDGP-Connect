import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import StudentAwardsClient from '@/components/student/StudentAwardsClient';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/types/prisma-types';

export const metadata: Metadata = {
  title: 'My Awards | Student',
};

export default async function StudentAwardsPage() {
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
          <h1 className='text-3xl font-bold'>My Awards</h1>
          <p className='text-muted-foreground'>
            Track awards linked to your projects and resubmit rejected entries.
          </p>
        </div>
        <Button asChild>
          <Link href='/student/awards/new'>New Award</Link>
        </Button>
      </div>

      <StudentAwardsClient />
    </div>
  );
}
