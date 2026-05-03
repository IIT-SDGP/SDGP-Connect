import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Award id is required" }, { status: 400 });
  }

  try {
    const award = await prisma.award.findUnique({
      where: { id },
      include: {
        competition: true,
        project: true,
        accepted_by: true,
        rejected_by: true,
      },
    });
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    return NextResponse.json({ award });
  } catch (error) {
    console.error("Error fetching award by id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
