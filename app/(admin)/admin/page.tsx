// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import RecentActivityTable from '@/components/dashboard/RecentActivityTable';
import StatCard from '@/components/dashboard/StatCard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import SubmissionsLineChart from '@/components/dashboard/SubmissionsLineChart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useGetTotalProjectsCount from '@/hooks/dashboard/useGetTotalProjectsCount';
import useGetPendingProjectsCount from '@/hooks/dashboard/useGetPendingProjectsCount';
import { Clock, Folder, Star, Laptop, LayoutGrid, Users } from 'lucide-react';
import useGetActivity from '@/hooks/dashboard/useGetActivity';
import useIsMobile from '@/hooks/useIsMobile';
import useGetCountByStatus from '@/hooks/dashboard/useGetCountByStatus';
import { AdminPageShell } from '@/components/layout/admin-page-shell';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const displayName = session?.user?.name?.trim() || 'there';

  const isMobile = useIsMobile();

  const { count: totalCount, isLoading: isTotalLoading } = useGetTotalProjectsCount();
  const { count: pendingCount, isLoading: isPendingLoading } = useGetPendingProjectsCount();
  const { statusCounts, isLoading: isApprovedLoading } = useGetCountByStatus();

  const stats = [
    {
      title: 'Approved Projects',
      value: isApprovedLoading ? <LoadingSpinner /> : statusCounts?.approvedCount?.toString() || '0',
      icon: <Star className="h-5 w-5" />,
      tone: 'emerald' as const,
      isLoading: isApprovedLoading
    },
    {
      title: 'Total Projects',
      value: isTotalLoading ? <LoadingSpinner /> : totalCount?.toString() || '0',
      icon: <Folder className="h-5 w-5" />,
      tone: 'blue' as const,
      isLoading: isTotalLoading
    },
    {
      title: 'Pending Review',
      value: isPendingLoading ? <LoadingSpinner /> : pendingCount?.toString() || '0',
      icon: <Clock className="h-5 w-5" />,
      tone: 'amber' as const,
      isLoading: isPendingLoading
    },
  ];

  const { activities: recentActivities } = useGetActivity();

  return (
    <AdminPageShell
      kicker="Overview"
      title="Dashboard"
      description={`Welcome back, ${displayName}. Track submissions, reviews, and platform health at a glance.`}
      actions={
        <>
          <Button variant="outline" size="sm" asChild className="rounded-xl border-border/80 shadow-sm">
            <Link href="/admin/projects">
              <LayoutGrid className="size-4" />
              Projects
            </Link>
          </Button>
          <Button size="sm" asChild className="rounded-xl shadow-md">
            <Link href="/admin/users">
              <Users className="size-4" />
              Users
            </Link>
          </Button>
        </>
      }
    >
      {isMobile ? (
        <div className="admin-content-card flex items-start gap-3 border-primary/15 bg-primary/5">
          <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Laptop className="h-4 w-4" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For the best experience, use a tablet or desktop when managing tables, charts, and bulk actions.
          </p>
        </div>
      ) : null}

      <div>
        <p className="admin-section-title mb-4">Key metrics</p>
        <div className="admin-dashboard-stats">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="admin-section-title mb-4">Analytics</p>
        <div className="admin-dashboard-analytics">
          <StatusPieChart />
          <SubmissionsLineChart />
        </div>
      </div>

      <RecentActivityTable activities={recentActivities} />
    </AdminPageShell>
  );
}
