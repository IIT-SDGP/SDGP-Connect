// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, start_date, end_date, logo, cover_image } = body;

    // Validate required fields
    if (!name || !type || !description || !start_date || !end_date || !logo || !cover_image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate date logic
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Create competition in database
    const competition = await prisma.competition.create({
      data: {
        name,
        type,
        description,
        start_date: startDate,
        end_date: endDate,
        logo,
        cover_image,
        approval_status: "PENDING", // Default status
      },
    });

    return NextResponse.json(
      { 
        message: "Competition submitted successfully",
        competition: {
          id: competition.id,
          name: competition.name,
          approval_status: competition.approval_status
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating competition:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
