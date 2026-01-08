"use client";
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import Image from "next/image";
import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock1 } from "lucide-react";
import AwardCard from "@/components/competition/AwardCard";
import { useGetCompetitionAwards } from "@/hooks/awards/useGetCompetitionAwards";
import { useCompetitionInfo } from "@/hooks/competition/useCompetitionInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWinners } from "@/components/Empty-states/emptyState";
import { AwardsHero } from "@/components/competition/AwardsHero";
import { AwardsHeroSkeleton } from "@/components/competition/AwardsHeroSkeleton";

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ competition: string }>;
}) {
  const resolvedParams = use(params);
  const competitionId = resolvedParams.competition;
  const [showFull, setShowFull] = useState(false);
  const {
    awards,
    isLoading: isAwardsLoading,
    error: awardsError,
  } = useGetCompetitionAwards(competitionId);
  const {
    competition,
    isLoading: isCompetitionLoading,
    error: competitionError,
  } = useCompetitionInfo(competitionId);

  // -------------------- Loading State --------------------
  if (isAwardsLoading || isCompetitionLoading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <AwardsHeroSkeleton />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-40 mx-auto" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[250px] rounded-xl" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------- Error State --------------------
  if (awardsError || competitionError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load awards or competition info.
      </div>
    );
  }

  // -------------------- Main Render --------------------
  return (
    <div className="min-h-screen px-8 bg-[#0c0a09]">
      {/* Header */}

      <AwardsHero
        title={competition?.title}
        description={competition?.description}
        badgeText={competition?.type}
        startDate={competition?.startDate}
        endDate={competition?.endDate}
        primaryButtonText="Add your Award Win"
        primaryButtonLink={`/submit/award`}
        secondaryButtonText="View all Competitions"
        secondaryButtonLink="/competitions"
        imageUrl={competition?.coverImage}
      />
      {/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* Winners Section */}
      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Competition Winners
          </h2>
          {!isAwardsLoading && awards.length === 0 && (
            <div className="flex justify-center">
              <EmptyStateWinners />
            </div>
          )}
        </div>

        {/* Grid of Winner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {awards.map((winner) => (
            <AwardCard key={winner.id} winner={winner} />
          ))}
        </div>

      
      </div>
    </div>
  );
}





























