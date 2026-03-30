import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";

function normalizeTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeGroup(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized. You must be logged in." },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Only admins can access duplicate detection." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "500", 10), 1),
      5000
    );

    const pending = await prisma.projectContent.findMany({
      where: {
        status: {
          approved_status: ProjectApprovalStatus.PENDING,
        },
      },
      take: limit,
      select: {
        content_id: true,
        metadata_id: true,
        createdAt: true,
        metadata: {
          select: {
            title: true,
            group_num: true,
            project_id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const grouped = new Map<
      string,
      Array<{
        projectId: string;
        contentId: string;
        title: string;
        groupNumber: string;
        createdAt: string;
      }>
    >();

    for (const item of pending) {
      const title = item.metadata?.title ?? "";
      const groupNumber = item.metadata?.group_num ?? "";
      const key = `${normalizeTitle(title)}::${normalizeGroup(groupNumber)}`;

      const entry = {
        projectId: item.metadata_id,
        contentId: item.content_id,
        title,
        groupNumber,
        createdAt: item.createdAt.toISOString(),
      };

      const list = grouped.get(key) ?? [];
      list.push(entry);
      grouped.set(key, list);
    }

    const duplicates = Array.from(grouped.values())
      .filter((items) => items.length > 1)
      .map((items) => {
        const sorted = [...items].sort((a, b) => {
          const diff =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (diff !== 0) return diff;
          return b.projectId.localeCompare(a.projectId);
        });

        const keep = sorted[0];
        const reject = sorted.slice(1);

        return {
          key: `${normalizeTitle(keep.title)}::${normalizeGroup(keep.groupNumber)}`,
          title: keep.title,
          groupNumber: keep.groupNumber,
          keep,
          reject,
        };
      });

    const totalRejectable = duplicates.reduce((sum, d) => sum + d.reject.length, 0);

    return NextResponse.json({
      success: true,
      data: {
        groups: duplicates,
        totals: {
          groups: duplicates.length,
          rejectable: totalRejectable,
          scanned: pending.length,
          limit,
        },
      },
    });
  } catch (error: any) {
    console.error("Error detecting duplicate pending projects:", error);
    return NextResponse.json(
      {
        error: "Failed to detect duplicate projects",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

