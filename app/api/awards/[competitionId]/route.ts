// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";

export const GET = async (
  req: NextRequest,
  context: { params: { competitionId: string } }
) => {
  try {
    const params = await context.params;
    const competitionId = params.competitionId;
    if (!competitionId) {
      return NextResponse.json({ error: "competitionId is required" }, { status: 400 });
    }

    // Fetch competition details with correct field names
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: {
        name: true,
        description: true,
        type: true,
        start_date: true,
        end_date: true,
        cover_image: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    }

    // Map competition fields to frontend expected names
    const competitionData = {
      title: competition.name,
      description: competition.description,
      type: competition.type,
      startDate: competition.start_date,
      endDate: competition.end_date,
      coverImage: competition.cover_image,
    };

    // Fetch all awards for this competition, including project info
    const awards = await prisma.award.findMany({
      where: { competition_id: competitionId },
      include: {
        project: true
      }
    });

    // Format response
    const result = awards.map((award) => ({
      id: award.project?.project_id || "", // Use project.project_id for navigation
      projectName: award.project?.title || "",
      team: award.project?.group_num || "",
      sdgpYear: award.project?.sdgp_year || "",
      cover: award.image || "",
      award: award.name,
      description: award.project?.subtitle || "",
    }));

    return NextResponse.json({
      competition: competitionData,
      awards: result
    });
  } catch (error) {
    console.error("Error fetching awards by competition:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
