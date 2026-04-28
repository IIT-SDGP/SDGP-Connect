// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
  tone?: "violet" | "blue" | "amber" | "emerald";
  className?: string;
  style?: React.CSSProperties;
}

const toneStyles: Record<
  NonNullable<StatCardProps["tone"]>,
  { glow: string; badge: string; bar: string }
> = {
  violet: {
    glow: "bg-violet-500/18",
    badge: "bg-violet-500/12 text-violet-600 ring-1 ring-violet-500/25 dark:text-violet-400",
    bar: "from-violet-500 to-fuchsia-500",
  },
  blue: {
    glow: "bg-sky-500/18",
    badge: "bg-sky-500/12 text-sky-600 ring-1 ring-sky-500/25 dark:text-sky-400",
    bar: "from-sky-500 to-blue-600",
  },
  amber: {
    glow: "bg-amber-500/18",
    badge: "bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-400",
    bar: "from-amber-500 to-orange-500",
  },
  emerald: {
    glow: "bg-emerald-500/18",
    badge: "bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400",
    bar: "from-emerald-500 to-teal-500",
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, tone = "violet", className, style }) => {
  const selectedTone = toneStyles[tone];

  return (
    <Card
      className={cn(
        'admin-surface group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5',
        className
      )}
      style={style}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90',
          selectedTone.bar
        )}
        aria-hidden
      />
      <div
        className={cn(
          'absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-110 group-hover:opacity-100',
          selectedTone.glow
        )}
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </p>
          <div className="mt-3 tabular-nums text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {value}
          </div>
        </div>
        <div
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-2xl shadow-sm',
            selectedTone.badge
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
