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
import useGetFeaturedProjectsCount from '@/hooks/dashboard/useGetFeaturedProjectsCount';
import useGetPendingProjectsCount from '@/hooks/dashboard/useGetPendingProjectsCount';
import { Clock, Folder, Star, Laptop } from 'lucide-react';
import useGetActivity from '@/hooks/dashboard/useGetActivity';
import useIsMobile from '@/hooks/useIsMobile';
import useGetCountByStatus from '@/hooks/dashboard/useGetCountByStatus';

export default function DashboardPage() {
  // Use the mobile detection hook
  const isMobile = useIsMobile();

  // Fetch real data using custom hooks
  const { count: totalCount, isLoading: isTotalLoading } = useGetTotalProjectsCount();
  const { count: pendingCount, isLoading: isPendingLoading } = useGetPendingProjectsCount();
  const { statusCounts, isLoading:isApprovedLoading, error } = useGetCountByStatus();
  
  // Stats card data
  const stats = [
    {
      title: 'Approved Projects',
      value: isApprovedLoading ? <LoadingSpinner /> : statusCounts?.approvedCount?.toString() || '0',
      icon: <Star className="h-5 w-5" />,
      isLoading: isApprovedLoading
    },
    {
      title: 'Total Projects',
      value: isTotalLoading ? <LoadingSpinner /> : totalCount?.toString() || '0',
      icon: <Folder className="h-5 w-5" />,
      isLoading: isTotalLoading
    },
    {
      title: 'Pending Review',
      value: isPendingLoading ? <LoadingSpinner /> : pendingCount?.toString() || '0',
      icon: <Clock className="h-5 w-5" />,
      isLoading: isPendingLoading
    },
  ];

  const { activities: recentActivities, isLoading: isActivitiesLoading, error: activitiesError } = useGetActivity();

  // Mobile fallback UI
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <Laptop className="h-16 w-16 mb-4 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Desktop View Required</h2>
        <p className="text-muted-foreground mb-4">
          The admin dashboard is optimized for larger screens. Please open this page on a laptop or desktop computer for the best experience.
        </p>
        <div className="p-4 bg-muted rounded-lg max-w-md">
          <p className="text-sm">
            If you need immediate access on mobile, you can request the desktop site in your browser settings, but functionality may be limited.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your platform.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatusPieChart/>
        <SubmissionsLineChart />
      </div>
      
      {/* Recent Activity Table */}
      <RecentActivityTable activities={recentActivities} />
    </>
  );
}
