"use client";

import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import useGetActivity from "@/hooks/dashboard/useGetActivity";
import { useSession } from "next-auth/react";
import * as React from "react";

function getTimeGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const { activities: recentActivities, isLoading: isActivitiesLoading, error } = useGetActivity();

  const [greeting, setGreeting] = React.useState(() => getTimeGreeting(new Date()));

  React.useEffect(() => {
    // Update greeting when crossing a time boundary (minute-level is enough)
    const id = window.setInterval(() => setGreeting(getTimeGreeting(new Date())), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const userName = session?.user?.name?.trim() || "there";

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground mt-2">Here’s what’s been happening recently.</p>
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable
        activities={recentActivities}
        isLoading={isActivitiesLoading}
        error={error}
      />
    </>
  );
}

