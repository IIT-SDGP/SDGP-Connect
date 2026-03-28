import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { EmailOutboxStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "FAILED").toUpperCase();
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 200);

    const status = Object.values(EmailOutboxStatus).includes(statusParam as any)
      ? (statusParam as EmailOutboxStatus)
      : EmailOutboxStatus.FAILED;

    const items = await prisma.emailOutbox.findMany({
      where: { status },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        type: true,
        to: true,
        subject: true,
        status: true,
        attempts: true,
        lastError: true,
        nextAttemptAt: true,
        createdAt: true,
        updatedAt: true,
        meta: true,
      },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    console.error("Error fetching email outbox:", err);
    return NextResponse.json(
      { error: "Failed to fetch email outbox", details: err.message },
      { status: 500 }
    );
  }
}

