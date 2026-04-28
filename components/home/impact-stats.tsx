// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { Award, Rocket, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: Record<string, unknown>, path: string[], fallback: unknown = undefined) {
  return path.reduce(
    (acc, key) =>
      acc && typeof acc === "object" && (acc as Record<string, unknown>)[key] !== undefined
        ? (acc as Record<string, unknown>)[key]
        : fallback,
    obj as unknown
  );
}

export default function ImpactStats() {
  const { t } = useLanguage();
  const impact = (getNested(t as Record<string, unknown>, ["home", "impact_stats"], {}) ||
    {}) as Record<string, unknown>;
  const s1 = (impact.stat_1 || {}) as Record<string, string>;
  const s2 = (impact.stat_2 || {}) as Record<string, string>;
  const s3 = (impact.stat_3 || {}) as Record<string, string>;
  const s4 = (impact.stat_4 || {}) as Record<string, string>;

  const stats = [
    { title: s1.title || "1000+", description: s1.description || "Student Projects", icon: Users },
    { title: s2.title || "100+", description: s2.description || "Industry Partners", icon: Award },
    { title: s3.title || "15+", description: s3.description || "SDGs Addressed", icon: TrendingUp },
    { title: s4.title || "50+", description: s4.description || "Startups Invested", icon: Rocket },
  ];

  return (
    <section className="relative border-t border-border/40 py-24 md:py-32">
      <div className="absolute inset-0 bg-muted/25 dark:bg-muted/10" />
      <div className="container relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {String(impact.title || "Our Impact")}
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground">
            The SDGP ecosystem in numbers — compounding projects, partners, and outcomes every year.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/60">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center px-4 py-10 text-center lg:px-6"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-inner transition group-hover:scale-105 group-hover:bg-primary/18">
                <stat.icon className="h-7 w-7" aria-hidden />
              </div>
              <p className="font-semibold tabular-nums tracking-tight text-foreground text-4xl sm:text-5xl">
                {stat.title}
              </p>
              <p className="mt-3 max-w-[12rem] text-sm font-medium leading-snug text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
