import { prisma } from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { ApprovalStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Session user not found in database" },
        { status: 400 }
      );
    }

    await prisma.competition.update({
      where: { id },
      data: {
        approval_status: ApprovalStatus.APPROVED,
        accepted_by_id: session.user.id,
        rejected_by_id: null,
        rejected_reason: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to approve competition:", error);
    return NextResponse.json(
      { error: "Failed to approve competition" },
      { status: 500 }
    );
  }
}
