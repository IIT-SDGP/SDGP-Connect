// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import Image from "next/image"
import { Calendar, ArrowUpRight, Trophy } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CompetitionCardProps {
  id: string
  title: string
  cover: string
  type: string
  startDate: string
  endDate: string
  logo: string
  viewLink: string
  description: string
  winnersCount: number
}

export default function CompetitionCard({
  title,
  cover,
  type,
  startDate,
  endDate,
  logo,
  viewLink,
  description,
  winnersCount,
}: CompetitionCardProps) {
  const router = useRouter()

  const formattedStart = startDate ? format(new Date(startDate), "MMM d, yyyy") : ""
  const formattedEnd = endDate ? format(new Date(endDate), "MMM d, yyyy") : ""
  const dateRange =
    formattedStart && formattedEnd
      ? `${formattedStart} – ${formattedEnd}`
      : formattedStart || formattedEnd

  const handleCardClick = () => {
    router.push(viewLink)
  }

  return (
    <article
      className="group flex h-full cursor-pointer flex-col"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={`View competition: ${title}`}
    >
      <div
        className={cn(
          "relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-sm ring-1 ring-border/45",
          "transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:ring-primary/15",
        )}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1),transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative aspect-video overflow-hidden bg-muted/60">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {type && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-md border border-white/15 bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
              {type}
            </span>
          )}

          <span className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            <Trophy className="h-3 w-3" aria-hidden />
            {winnersCount} {winnersCount === 1 ? "winner" : "winners"}
          </span>

          <div className="absolute -bottom-5 left-4 z-10 h-11 w-11 overflow-hidden rounded-xl border-2 border-background bg-background shadow-md ring-1 ring-border/50">
            <Image
              src={logo}
              alt=""
              fill
              className="object-contain p-1"
              sizes="44px"
            />
          </div>
        </div>

        <div className="relative z-[2] flex flex-1 flex-col gap-2.5 p-3.5 pt-7 sm:p-4 sm:pt-8">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[0.95rem]">
            {title}
          </h3>

          <p className="line-clamp-2 flex-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
            <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground sm:text-[11px]">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{dateRange}</span>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium sm:text-[11px]",
                "bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              View
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
