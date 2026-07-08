// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import CompetitionCard from "@/components/competition/CompetitionCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApprovedCompetitions } from "@/hooks/competition/useApprovedCompetitions"
import { cn, dockNavClearance, dualGlowBg, heroGlowBg } from "@/lib/utils"
import {
  Award,
  ChevronRight,
  LayoutGrid,
  PenLine,
  Target,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

const pageShell = cn(
  "relative z-10 w-full min-w-0 px-4 sm:px-6 md:px-0",
  dockNavClearance,
)

const heroImages = [
  { src: "/assets/Dialog.webp", alt: "Competition showcase", className: "col-span-2 aspect-[16/9]" },
  { src: "/assets/1.webp", alt: "Team at competition", className: "aspect-[4/3]" },
  { src: "/assets/2.webp", alt: "Award ceremony", className: "aspect-[4/3]" },
]

const heroStats = [
  { icon: Target, value: "50+", label: "Competitions" },
  { icon: Award, value: "100+", label: "Award Winners" },
]

function CompetitionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/90 ring-1 ring-border/45">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2.5 p-3.5 pt-7 sm:p-4 sm:pt-8">
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-2.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function CompetitionsPage() {
  const { competitions, isLoading, error, fetchMore, hasMore } = useApprovedCompetitions(9)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const fetchMoreRef = useRef(fetchMore)
  const hasMoreRef = useRef(hasMore)
  const isLoadingRef = useRef(isLoading)

  useEffect(() => {
    fetchMoreRef.current = fetchMore
  }, [fetchMore])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    const option = { root: null, rootMargin: "120px", threshold: 0 }
    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
        isLoadingRef.current = true
        fetchMoreRef.current()
      }
    }, option)

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [competitions.length])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-0 h-[720px]",
          heroGlowBg,
          "[mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)]",
        )}
      />

      {/* Hero — classic two-column layout */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className={pageShell}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-14">
            <div className="flex flex-col items-center text-center lg:items-start lg:justify-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-md">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                International &amp; Local
              </span>

              <h1 className="mt-5 max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:max-w-none lg:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                Celebrating{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                Discover the innovative teams and groundbreaking projects that have shaped our
                competitive landscape through creativity, technology, and determination.
              </p>

              <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
                {heroStats.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex h-full flex-col items-center rounded-2xl border border-border/50 bg-card/70 p-4 text-center backdrop-blur-sm sm:p-5 lg:items-start lg:text-left"
                  >
                    <span className="mb-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <p className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:max-w-none lg:justify-self-end xl:justify-self-center">
              <div className="absolute -inset-3 rounded-3xl bg-primary/8 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-3 shadow-sm ring-1 ring-border/45 backdrop-blur-sm sm:p-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {heroImages.map((image) => (
                    <div
                      key={image.src}
                      className={cn("relative overflow-hidden rounded-xl", image.className)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={image.src === "/assets/Dialog.webp"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-background sm:h-40 lg:h-48"
          aria-hidden
        />
      </section>

      {/* Competitions grid */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className={pageShell}>
          <div className="mb-8 flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25"
                aria-hidden
              >
                <LayoutGrid className="h-5 w-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                  Browse events
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  All competitions
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                  Tap a card to view winners, timelines, and award-winning projects.
                </p>
              </div>
            </div>

            {!isLoading && competitions.length > 0 && (
              <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-border/60 bg-card/80 px-3.5 py-1.5 text-xs tabular-nums text-muted-foreground backdrop-blur-sm sm:self-auto">
                <Trophy className="h-3.5 w-3.5 text-primary" aria-hidden />
                {competitions.length}
                {hasMore ? "+" : ""} events
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {isLoading && competitions.length === 0
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <CompetitionCardSkeleton key={idx} />
                ))
              : competitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    id={competition.id}
                    title={competition.name}
                    cover={competition.cover || "/assets/placeholder.svg"}
                    type={competition.type || ""}
                    startDate={competition.startDate}
                    endDate={competition.endDate}
                    logo={competition.logo || "/assets/placeholder.svg"}
                    viewLink={`/competitions/${competition.id}`}
                    description={competition.description}
                    winnersCount={competition.winnersCount}
                  />
                ))}
          </div>

          {competitions.length === 0 && !isLoading && !error && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border/50">
                <Trophy className="h-7 w-7 text-muted-foreground/70" />
              </div>
              <h3 className="text-lg font-semibold">No competitions yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                New events appear here once they are reviewed and approved.
              </p>
            </div>
          )}

          <div ref={loaderRef} className="flex justify-center py-10">
            {isLoading && competitions.length > 0 && (
              <span className="text-sm text-muted-foreground">Loading more…</span>
            )}
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className={pageShell}>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 p-6 shadow-sm ring-1 ring-border/50 sm:p-8">
              <div className={cn("pointer-events-none absolute inset-0", dualGlowBg)} />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                  <PenLine className="h-5 w-5 text-primary" />
                </span>
                <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                  Missing a competition?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Help grow the archive — submit an event that is not listed yet so others can
                  discover it.
                </p>
                <Link href="/dashboard/submit/competition" className="mt-6 inline-block">
                  <Button className="h-10 gap-2 rounded-xl px-5">
                    Submit competition
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 p-6 shadow-sm ring-1 ring-border/50 sm:p-8">
              <div className={cn("pointer-events-none absolute inset-0", dualGlowBg)} />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                  <Award className="h-5 w-5 text-primary" />
                </span>
                <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                  Won an award?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Share your achievement with the community and inspire the next generation of
                  builders.
                </p>
                <Link href="/dashboard/submit/award" className="mt-6 inline-block">
                  <Button variant="outline" className="h-10 gap-2 rounded-xl px-5">
                    Submit award win
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
