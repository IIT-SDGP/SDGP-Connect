// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import CompetitionCard from "@/components/competition/CompetitionCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApprovedCompetitions } from "@/hooks/competition/useApprovedCompetitions"
import { cn } from "@/lib/utils"
import { Award, LayoutGrid, PenLine, Target, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

const heroImages = [
  { src: "/assets/Dialog.webp", alt: "Competition showcase", className: "col-span-2 aspect-[16/9]" },
  { src: "/assets/1.webp", alt: "Team at competition", className: "aspect-[4/3]" },
  { src: "/assets/2.webp", alt: "Award ceremony", className: "aspect-[4/3]" },
]

function CompetitionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20 rounded-lg" />
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
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_80%_10%,rgba(34,197,246,0.08),transparent_45%)]" />

      {/* Hero */}
      <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-16">
        <div className={pageShell}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                International &amp; Local
              </span>

              <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                Celebrating{" "}
                <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                Discover the innovative teams and groundbreaking projects that have shaped our
                competitive landscape through creativity, technology, and determination.
              </p>

              <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
                {[
                  { icon: Target, value: "50+", label: "Competitions" },
                  { icon: Award, value: "100+", label: "Award Winners" },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-2xl border border-border/60 bg-card/70 p-4 text-center backdrop-blur-sm sm:p-5 lg:items-start lg:text-left"
                  >
                    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-3 rounded-3xl bg-primary/5 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-3 shadow-sm ring-1 ring-border/40 backdrop-blur-sm sm:p-4">
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
      </section>

      {/* Competitions grid */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className={pageShell}>
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 p-4 shadow-sm ring-1 ring-border/50 sm:p-5",
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.12),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_80%,rgba(34,197,246,0.08),transparent_38%)]" />

            <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="flex min-w-0 gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 ring-1 ring-primary/25"
                  aria-hidden
                >
                  <LayoutGrid className="h-[1.125rem] w-[1.125rem] text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">
                    Browse events
                  </p>
                  <h2 className="mt-0.5 text-balance text-xl font-bold tracking-tight sm:text-2xl">
                    All Competitions
                  </h2>
                  <p className="mt-1 max-w-2xl text-pretty text-xs text-muted-foreground sm:text-sm">
                    Explore competitive events and the teams that earned recognition.
                  </p>
                </div>
              </div>
              {!isLoading && competitions.length > 0 && (
                <p
                  className="shrink-0 text-xs tabular-nums text-muted-foreground sm:text-right"
                  aria-live="polite"
                >
                  {competitions.length}
                  {hasMore ? "+" : ""} loaded
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-6 2xl:grid-cols-3">
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
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
              <Trophy className="mb-4 h-10 w-10 text-muted-foreground/60" />
              <h3 className="text-lg font-semibold">No competitions yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Check back soon — new events are added as they are approved.
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
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 p-8 shadow-sm ring-1 ring-border/50 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.12),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_80%,rgba(34,197,246,0.08),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(135deg,black_0%,black_20%,transparent_80%,transparent_100%)] opacity-40" />

            <div className="relative mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                <PenLine className="h-5 w-5 text-primary" />
              </span>
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Share your winning project with the community
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Participated in a competition and won an award? Feature your project here and
                inspire others in the community.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link href="/dashboard/submit/competition" className="sm:flex-1 sm:max-w-[240px]">
                  <Button size="lg" className="h-11 w-full rounded-xl">
                    Enter a missing competition
                  </Button>
                </Link>
                <Link href="/dashboard/submit/award" className="sm:flex-1 sm:max-w-[240px]">
                  <Button size="lg" variant="outline" className="h-11 w-full rounded-xl">
                    Submit your award win
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
