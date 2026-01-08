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

    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: {
        id: true,
        name: true, // <-- use 'name' instead of 'title'
        description: true,
        start_date: true,
        end_date: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: competition.id,
      title: competition.name, // <-- map 'name' to 'title' in response
      description: competition.description,
      startDate: competition.start_date,
      endDate: competition.end_date,
    });
  } catch (error) {
    console.error("Error fetching competition info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
