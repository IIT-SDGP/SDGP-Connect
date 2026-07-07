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
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80",
          "transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-primary/5",
        )}
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {type && (
            <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {type}
            </span>
          )}

          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Trophy className="h-3 w-3" />
            {winnersCount} {winnersCount === 1 ? "winner" : "winners"}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-background">
              <Image
                src={logo}
                alt=""
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
            <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 sm:text-[1.05rem]">
              {title}
            </h3>
          </div>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{dateRange}</span>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                "bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
