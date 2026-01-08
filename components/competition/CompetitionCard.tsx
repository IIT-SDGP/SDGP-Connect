// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import Image from "next/image"
import { Calendar, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

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
  id,
  title,
  cover,
  type,
  startDate,
  endDate,
  logo,
  viewLink,
  description,
  winnersCount
}: CompetitionCardProps) {
  const router = useRouter()
  
  // Format dates
  const formattedStart = startDate ? format(new Date(startDate), "MMM d yyyy") : ""
  const formattedEnd = endDate ? format(new Date(endDate), "MMM d yyyy") : ""
  
  const handleCardClick = () => {
    router.push(viewLink)
  }
  
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(viewLink)
  }
  
  return (
    <div 
      className="group block h-full cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={`View competition: ${title}`}
    >
      <div className="relative bg-secondary rounded-2xl overflow-hidden border border-black hover:border-gray-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-950/20 min-h-[450px] flex flex-col">
        {/* Subtle Blue Glow on Hover */}
        <div className=" bg-blue-950 absolute inset-0  opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>

        {/* Competition Image */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 backdrop-blur-sm border border-gray-800 px-2.5 py-1.5 rounded-full text-xs font-medium text-white">
              {type}
            </span>
          </div>

          {/* Winners Count */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-secondary text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg border border-gray-700">
              {winnersCount} Winners
            </div>
          </div>
        </div>
        {/* Competition Details */}
        <div className="p-4 pb-6 flex flex-col flex-grow justify-between">
          <div className="space-y-2.5">
            <h3 className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
              {title}
            </h3>
            <p className="text-gray-200 leading-relaxed text-sm line-clamp-3 min-h-[3.75rem]">
              {description}
            </p>
          </div>
          <div className="space-y-2.5 mt-3">
            <div className="flex items-center justify-between text-xs text-gray-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span className="truncate">{formattedStart} - {formattedEnd}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom-right Arrow Button - Using button instead of nested anchor */}
        <button
          onClick={handleArrowClick}
          className="absolute bottom-4 right-4 z-20 border border-white rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300 shadow-lg cursor-pointer"
          title="View Competition"
          aria-label="View competition details"
        >
          <ArrowUpRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
