// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Role } from '@/types/prisma-types'
import { Rocket, Trophy, Award, BookOpen } from 'lucide-react'
import StudentDashboardClient from '@/components/dashboard/StudentDashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | Student',
}

const actionCards = [
  {
    icon: <Rocket className='h-8 w-8' />,
    title: 'Submit a Project',
    description:
      'Share your innovation, research, or development work. Projects of all scopes are welcome.',
    buttonLabel: 'Submit Project',
    href: '/submit/project',
  },
  {
    icon: <Trophy className='h-8 w-8' />,
    title: 'Submit a Competition',
    description:
      'Participated in a hackathon or tech challenge? Let your competitive spirit shine.',
    buttonLabel: 'Submit Competition',
    href: '/submit/competition',
  },
  {
    icon: <Award className='h-8 w-8' />,
    title: 'Submit an Award',
    description:
      'Been recognized for your achievements? Add your award to our showcase.',
    buttonLabel: 'Submit Award',
    href: '/submit/award',
  },
  {
    icon: <BookOpen className='h-8 w-8' />,
    title: 'Manage Blogs',
    description:
      'Create new blog posts, edit rejected drafts, and keep an eye on moderation status.',
    buttonLabel: 'Open Blogs',
    href: '/student/blogs',
  },
  {
    icon: <Award className='h-8 w-8' />,
    title: 'Manage Awards',
    description:
      'Review your award submissions, fix rejected entries, and resubmit them from one place.',
    buttonLabel: 'Open Awards',
    href: '/student/awards',
  },
]

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)

  // Must be authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Must be a STUDENT
  if (session.user.role !== Role.STUDENT) {
    redirect('/unauthorized')
  }

  return <StudentDashboardClient actionCards={actionCards} />
}
