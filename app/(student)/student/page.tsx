"use client";

import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import useGetActivity from "@/hooks/dashboard/useGetActivity";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Rocket, Trophy, Award } from "lucide-react";
import Link from "next/link";

function getTimeGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

function ActionCard({ icon, title, description, buttonLabel, href }: ActionCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="text-primary">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-bold tracking-tight mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity w-fit"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const {
    activities: recentActivities,
    isLoading: isActivitiesLoading,
    error,
  } = useGetActivity();

  const [greeting, setGreeting] = React.useState(() =>
    getTimeGreeting(new Date())
  );

  React.useEffect(() => {
    const id = window.setInterval(
      () => setGreeting(getTimeGreeting(new Date())),
      60_000
    );
    return () => window.clearInterval(id);
  }, []);

  const userName = session?.user?.name?.trim() || "there";

  const actionCards: ActionCardProps[] = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Submit a Project",
      description:
        "Share your innovation, research, or development work. Projects of all scopes are welcome.",
      buttonLabel: "Submit Project",
      href: "/submit/project",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Submit a Competition",
      description:
        "Participated in a hackathon or tech challenge? Let your competitive spirit shine.",
      buttonLabel: "Submit Competition",
      href: "/submit/competition",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Submit an Award",
      description:
        "Been recognized for your achievements? Add your award to our showcase.",
      buttonLabel: "Submit Award",
      href: "/submit/award",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's been happening recently.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
        {actionCards.map((card, i) => (
          <ActionCard key={i} {...card} />
        ))}
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