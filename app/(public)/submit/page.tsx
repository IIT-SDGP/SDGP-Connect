// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Award,
  HelpCircle,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SubmitKind = {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: typeof Rocket;
  accent: string;
  shimmerBg: string;
  shimmerHighlight: string;
};

const KINDS: SubmitKind[] = [
  {
    href: "/submit/project",
    title: "Project",
    description:
      "Innovation, research, or coursework—with SDG alignment, media, and team info.",
    cta: "Submit project",
    icon: Rocket,
    accent:
      "from-primary/20 via-primary/5 to-transparent border-primary/25 shadow-primary/10",
    shimmerBg:
      "linear-gradient(145deg, #0f172a 0%, #1d4ed8 42%, #2563eb 70%, #1e40af 100%)",
    shimmerHighlight: "rgba(255, 255, 255, 0.92)",
  },
  {
    href: "/submit/competition",
    title: "Competition",
    description:
      "Hackathons and challenges: outcomes, links, and proof of participation.",
    cta: "Submit competition",
    icon: Trophy,
    accent:
      "from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/20 shadow-emerald-500/10",
    shimmerBg: "linear-gradient(145deg, #047857 0%, #059669 55%, #0d9488 100%)",
    shimmerHighlight: "rgba(167, 243, 208, 0.95)",
  },
  {
    href: "/submit/award",
    title: "Award",
    description:
      "Formal recognition—ceremonies, merit lists, or honors—for your profile.",
    cta: "Submit award",
    icon: Award,
    accent:
      "from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/25 shadow-amber-500/10",
    shimmerBg: "linear-gradient(145deg, #b45309 0%, #d97706 45%, #ca8a04 100%)",
    shimmerHighlight: "rgba(254, 243, 199, 0.95)",
  },
];

/** One-line rules so the whole story fits above the fold on desktop */
const RULES_LINE =
  "One team member submits for the group · Double-check before send (no edits after) · Approved entries may appear on the platform";

export default function SubmitHubPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_92%)]" />
        <div className="absolute -left-[20%] top-[-10%] h-[min(380px,32vh)] w-[min(420px,65vw)] rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="absolute -right-[15%] bottom-[10%] h-[min(320px,28vh)] w-[min(360px,55vw)] rounded-full bg-chart-2/10 blur-3xl dark:bg-chart-2/12" />
        <div
          className="absolute inset-0 opacity-[0.28] dark:opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Top / middle / bottom stitched to viewport; cards centered in the middle band */}
      <div className="relative z-0 flex min-h-0 flex-1 flex-col justify-between gap-4 px-4 pt-3 pb-3 max-md:pb-24 sm:px-6 sm:pt-4 sm:pb-4 md:gap-5">
        <div className="mx-auto w-full max-w-6xl shrink-0 lg:max-w-7xl">
          <header className="grid gap-3 lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-start lg:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles className="size-3 text-primary" aria-hidden />
                Submit
              </div>
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[2rem] lg:leading-tight">
                Choose what you are sharing—we open the right form.
              </h1>
              <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                Three paths below:{" "}
                <strong className="font-medium text-foreground">project</strong>,{" "}
                <strong className="font-medium text-foreground">competition</strong>, or{" "}
                <strong className="font-medium text-foreground">award</strong>. Pick one; each
                step is tailored so reviewers get exactly what they need.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                >
                  <HelpCircle className="size-3.5 shrink-0" aria-hidden />
                  Submission FAQ
                </Link>
                <span className="hidden text-border sm:inline" aria-hidden>
                  ·
                </span>
                <Link
                  href="/project"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Browse projects
                </Link>
              </div>
            </div>

            <aside className="rounded-xl border border-border/80 bg-card/80 px-3.5 py-2.5 shadow-sm backdrop-blur-sm dark:bg-card/55 sm:py-3">
              <p className="text-xs font-medium text-foreground">After you send it</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your entry goes to review; you get email when there is a decision (often
                within a few days).
              </p>
              <p className="mt-2 border-t border-border/60 pt-2 text-[11px] leading-snug text-muted-foreground lg:text-xs">
                {RULES_LINE}
              </p>
            </aside>
          </header>
        </div>

        <section
          aria-labelledby="submit-options-heading"
          className={cn(
            "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-center lg:max-w-7xl"
          )}
        >
          <h2 id="submit-options-heading" className="sr-only">
            Submission types
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {KINDS.map((kind, index) => {
              const Icon = kind.icon;
              return (
                <Card
                  key={kind.href}
                  className={cn(
                    "group relative flex h-full min-h-[200px] flex-col overflow-hidden border bg-gradient-to-br py-0 shadow-sm transition-shadow hover:shadow-md sm:min-h-[220px]",
                    kind.accent
                  )}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-background/35 blur-2xl dark:bg-background/15" />
                  <CardHeader className="relative flex-1 space-y-2.5 pb-2 pt-3 sm:space-y-3 sm:pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg border bg-background/80 shadow-sm backdrop-blur-sm sm:size-11",
                          index === 0 && "border-primary/25 text-primary",
                          index === 1 &&
                            "border-emerald-500/25 text-emerald-600 dark:text-emerald-400",
                          index === 2 &&
                            "border-amber-500/25 text-amber-600 dark:text-amber-400"
                        )}
                      >
                        <Icon className="size-5 sm:size-[1.375rem]" aria-hidden />
                      </div>
                      {index === 0 ? (
                        <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                          Common
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold sm:text-lg">
                        {kind.title}
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed sm:text-sm line-clamp-3 sm:line-clamp-none">
                        {kind.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="relative mt-auto border-0 pb-3 pt-0 sm:pb-4">
                    <ShimmerButton
                      type="button"
                      background={kind.shimmerBg}
                      shimmerColor={kind.shimmerHighlight}
                      borderRadius="0.5rem"
                      className="h-11 w-full px-4 text-sm font-semibold shadow-md"
                      shimmerDuration="2.5s"
                      onClick={() => router.push(kind.href)}
                    >
                      {kind.cta}
                    </ShimmerButton>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <p className="mx-auto w-full max-w-6xl shrink-0 text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs lg:max-w-7xl">
          Wrong type or need help?{" "}
          <Link
            href="/contact"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Contact
          </Link>
          {" · "}
          <Link
            href="/faq"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            FAQ
          </Link>
        </p>
      </div>
    </div>
  );
}
