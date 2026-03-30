import { prisma } from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { ApprovalStatus } from "@prisma/client";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { reason } = await req.json();
  if (!reason) {
    return NextResponse.json({ error: "Rejection reason required" }, { status: 400 });
  }  try {
    // Validate that the user exists in the database before updating
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "Session user not found in database" }, { status: 400 });
    }
    
    await prisma.competition.update({
      where: { id },
      data: {
        approval_status: ApprovalStatus.REJECTED,
        rejected_by_id: session.user.id,
        rejected_reason: reason,
        accepted_by_id: null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject competition" }, { status: 500 });
  }
}
