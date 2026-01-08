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
    const limit = Math.min(parseInt(searchParams.get("limit") || "9", 10), 30);
    const cursor = searchParams.get("cursor");

    // Fetch competitions + award counts in one go
    const comps = await prisma.competition.findMany({
  where: {
    approval_status: ApprovalStatus.APPROVED,
  },
  select: {
    id: true,
    name: true,
    type: true,
    description: true,
    logo: true,
    cover_image: true,
    start_date: true,
    end_date: true,
    _count: {
      select: { awards: true },
    },
  },
  orderBy: [
    // 1) Sort by number of related awards, descending
    { awards: { _count: 'desc' } },
    // 2) Then by creation date, descending for stable ordering
    { createdAt: 'desc' },
    // 3) Finally by ID for absolute uniqueness
    { id: 'asc' },
  ],
  take: limit,
  ...(cursor && { skip: 1, cursor: { id: cursor } }),
});

    // Map into your desired shape
    const result = comps.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      logo: c.logo,
      cover: c.cover_image,
      startDate: c.start_date,
      endDate: c.end_date,
      winnersCount: c._count.awards,   // accurate count, even if zero
    }));

    // Compute next cursor for pagination
    const nextCursor =
      comps.length === limit ? comps[comps.length - 1].id : null;

    return NextResponse.json({ competitions: result, nextCursor });
  } catch (error) {
    console.error("Error fetching approved competitions:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved competitions" },
      { status: 500 }
    );
  }
};
