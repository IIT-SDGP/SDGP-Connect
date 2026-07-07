import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Competition id is required" }, { status: 400 });
  }

  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        accepted_by: true,
        rejected_by: true,
        awards: true,
      },
    });
    if (!competition) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    }
    return NextResponse.json({ competition });
  } catch (error) {
    console.error("Error fetching competition by id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
