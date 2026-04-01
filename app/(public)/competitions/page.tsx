// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import CompetitionCard from "@/components/competition/CompetitionCard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useApprovedCompetitions } from "@/hooks/competition/useApprovedCompetitions"
import { ArrowRight, Award, Pen, Play, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function AwardsPage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const router = useRouter()

  // Infinite scroll logic
  const { competitions, isLoading, error, fetchMore, hasMore } = useApprovedCompetitions(9)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Use refs to store latest values without triggering observer recreation
  const fetchMoreRef = useRef(fetchMore)
  const hasMoreRef = useRef(hasMore)
  const isLoadingRef = useRef(isLoading)

  // Keep refs up to date
  useEffect(() => {
    fetchMoreRef.current = fetchMore
  }, [fetchMore])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  const handleClick = () => {
    router.push("/contact")
  }

  // Setup intersection observer once - uses refs to avoid recreating on every state change
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    const option = { root: null, rootMargin: "20px", threshold: 0 }
    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
        fetchMoreRef.current()
      }
    }, option)

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, []) // Empty dependency array - only run once on mount

  return (
    <div className="min-h-screen bg-#0c0a09">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 xl:pt-32 pb-12 sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="container relative max-w-7xl mx-auto">
          <div className="grid items-center gap-8 lg:gap-16 lg:grid-cols-2">
            {/* Content Section */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2">
                  <span className="text-sm font-medium text-white">International & Local Competition</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight text-white">
                  Celebrating <span className="text-gray-300">Excellence</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
                  Discover the innovative teams and groundbreaking projects that have shaped our competitive landscape
                  through creativity, technology, and determination.
                </p>
                <div className="flex flex-wrap  gap-4 sm:gap-6 lg:gap-8">

                  <div className="rounded-xl p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight text-foreground">
                      50 +
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">Competitions</p>
                  </div>
                  <div className="rounded-xl p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight text-foreground">
                      100 +
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">Competition Winners</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-4 -z-10 rounded-2xl bg-blue-950/10 blur-sm" />

              <div className="grid gap-4 rounded-xl bg-accent/50 p-6 md:gap-6">

                <Image
                  src={"/assets/Dialog.webp"}
                  alt={"Mission 1"}
                  width={600}
                  height={400}
                  className={"rounded-xl"}
                />

                <div className="grid grid-cols-2 gap-4 md:gap-6">

                    <div className="overflow-hidden rounded-xl shadow-md transition-transform hover:scale-[1.02]">
                    <Image
                      src={"/assets/1.webp"}
                      alt={"Mission 2"}
                      width={280}
                      height={200}
                      className={"rounded-xl object-cover"}
                      style={{ height: "200px", width: "auto" }}
                    />
                    </div>

                    <div className="overflow-hidden rounded-xl shadow-md transition-transform hover:scale-[1.02]">
                    <Image
                      src={"/assets/2.webp"}
                      alt={"Mission 3"}
                      width={280}
                      height={200}
                      className={"rounded-xl object-cover"}
                      style={{ height: "200px", width: "auto" }}
                    />
                    </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Competitions Grid */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">All Competitions</h2>
          <p className="text-base text-gray-400">Explore our competitive events and their winners</p>
        </div>
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
          {isLoading && competitions.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-xl border border-gray-700 bg-gray-800 p-6 flex flex-col gap-4 shadow-lg"
              >
                <div className="h-40 bg-gray-700 rounded-md mb-4" />
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/3" />
              </div>
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
        <div ref={loaderRef} className="flex justify-center py-8">
          {isLoading && <span className="text-gray-400">Loading...</span>}
          {!hasMore && !isLoading && <span className="text-gray-500"></span>}
          {error && <span className="text-red-500">{error}</span>}
        </div>
      </div>

      {/* CTA section */}
      <section className="relative m-16 overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent/80 to-accent/60 p-8 md:p-12 border border-accent/20 shadow-2xl">
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Want to share your winning project with the community?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
        If you have participated in a competition and won an award, we would love to feature your project.
        share your achievement with us and inspire others in the community.
        </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
          
          <Link href="/submit/competition">
          <Button size="lg" variant="default">
          
           Enter a missing Competition
          </Button>
        </Link>
        <Link href="/submit/award">
          <Button size="lg" variant="outline" >
           Submit your Award Win
          </Button>
        </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(135deg,black_0%,black_20%,transparent_80%,transparent_100%)] opacity-40" />
      </section>
    </div>
  )
}