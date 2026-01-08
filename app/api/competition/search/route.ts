// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { ApprovalStatus } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // Get search query and pagination params
    const query = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 20); // Max 20, default 5

    // Build where condition for search
    const whereCondition: any = {
      approval_status: ApprovalStatus.APPROVED
    };

    // Add search condition if query exists
    if (query.trim()) {
      whereCondition.name = { contains: query };
    }

    // Fetch competitions with required fields
    const competitions = await prisma.competition.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        logo: true,
        start_date: true,
        end_date: true,
      },
      orderBy: {
        createdAt: 'desc' // Recent first
      },
      take: limit,
    });

    return NextResponse.json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitions" },
      { status: 500 }
    );
  }
};
