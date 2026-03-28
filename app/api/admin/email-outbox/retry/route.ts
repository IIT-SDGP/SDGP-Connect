import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { retryOutboxEmail } from "@/lib/email/outbox";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
    if (!ids.length) {
      return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
    }

    // Ensure they exist first (avoids leaking info via timing on update)
    const existing = await prisma.emailOutbox.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const existingIds = existing.map((e) => e.id);

    await Promise.all(existingIds.map((id) => retryOutboxEmail(id)));

    return NextResponse.json({
      success: true,
      message: `Queued ${existingIds.length} email(s) for retry`,
      data: { queued: existingIds.length },
    });
  } catch (err: any) {
    console.error("Error retrying outbox emails:", err);
    return NextResponse.json(
      { error: "Failed to retry emails", details: err.message },
      { status: 500 }
    );
  }
}

