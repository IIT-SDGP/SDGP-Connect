// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

interface AwardCardProps {
  winner: {
    id: string
    projectName: string
    team: string
    sdgpYear: string
    cover: string
    award: string
    description: string
  }
}

export default function AwardCard({ winner }: AwardCardProps) {
  const router = useRouter();
  return (
    <div
      className="group h-full relative bg-secondary rounded-2xl overflow-hidden border border-black hover:border-gray-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 min-h-[380px] flex flex-col cursor-pointer"
      onClick={() => router.push(`/project/${winner.id}`)}
    >
      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>

      {/* Team Image */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden flex-shrink-0">
        <Image
          src={winner.cover}
          alt={winner.projectName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        {/* Award Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 backdrop-blur-sm border border-gray-800 px-2.5 py-1.5 rounded-full text-xs font-medium text-white">
            {winner.award}
          </span>
        </div>
      </div>
      {/* Team Details */}
      <div className="p-4 pb-6 flex flex-col flex-grow justify-between">
        <div className="space-y-2.5">
          <h3 className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {winner.projectName}
          </h3>
          <p className="text-gray-200 leading-relaxed text-sm line-clamp-3 min-h-[3.75rem]">
            {winner.description}
          </p>
        </div>
        <div className="space-y-2.5 mt-3">
          <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium line-clamp-2 leading-relaxed">
            Team {winner.team} | SDGP {winner.sdgpYear}
          </p>
        </div>
      </div>
      {/* Bottom-right Arrow Button - Using button instead of nested anchor */}
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          router.push(`/project/${winner.id}`);
        }}
        className="absolute bottom-4 right-4 z-20 border border-white rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300 shadow-lg cursor-pointer"
        title="View Project"
        aria-label="View project details"
      >
        <ArrowUpRight className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}