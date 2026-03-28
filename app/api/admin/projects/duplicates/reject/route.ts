import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { rejectedTemplate } from "@/lib/email/templates/rejected";

function normalizeTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeGroup(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDuplicateReason(params: {
  keptProjectId: string;
  keptCreatedAtIso: string;
  rejectedCreatedAtIso: string;
}) {
  // Keep this message compact and hard-truncate to avoid Prisma P2000.
  const format = (iso: string) =>
    new Date(iso).toISOString().slice(0, 19).replace("T", " ");

  const newCreatedAt = format(params.keptCreatedAtIso);
  const oldCreatedAt = format(params.rejectedCreatedAtIso);

  const base = `Duplicate Submission. Recent submission will be reviewed. New submission created at: ${newCreatedAt}. Duplicate submission created at: ${oldCreatedAt}.`;
  const maxLen = 180;
  return base.length > maxLen ? `${base.slice(0, maxLen - 1)}…` : base;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized. You must be logged in." },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Only admins can bulk-reject duplicates." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const dryRun = searchParams.get("dryRun") === "true";
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
            featured: true,
          },
        },
        projectDetails: {
          select: {
            team_email: true,
          },
        },
        status: {
          select: {
            approved_status: true,
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
        contentId: string;
        projectId: string;
        title: string;
        groupNumber: string;
        createdAtIso: string;
        teamEmail?: string | null;
      }>
    >();

    for (const item of pending) {
      const title = item.metadata?.title ?? "";
      const groupNumber = item.metadata?.group_num ?? "";
      const key = `${normalizeTitle(title)}::${normalizeGroup(groupNumber)}`;

      const entry = {
        contentId: item.content_id,
        projectId: item.metadata_id,
        title,
        groupNumber,
        createdAtIso: item.createdAt.toISOString(),
        teamEmail: item.projectDetails?.team_email,
      };

      const list = grouped.get(key) ?? [];
      list.push(entry);
      grouped.set(key, list);
    }

    const groups = Array.from(grouped.values())
      .filter((items) => items.length > 1)
      .map((items) => {
        const sorted = [...items].sort((a, b) => {
          const diff =
            new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime();
          if (diff !== 0) return diff;
          return b.projectId.localeCompare(a.projectId);
        });
        return {
          keep: sorted[0],
          reject: sorted.slice(1),
        };
      });

    const rejectables = groups.flatMap((g) =>
      g.reject.map((r) => ({
        ...r,
        keptProjectId: g.keep.projectId,
        keptCreatedAtIso: g.keep.createdAtIso,
      }))
    );

    if (rejectables.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No duplicate pending projects found.",
        data: { rejected: 0, kept: 0, groups: 0, dryRun },
      });
    }

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: `Found ${rejectables.length} rejectable duplicates (dry run).`,
        data: {
          rejected: 0,
          kept: groups.length,
          groups: groups.length,
          dryRun,
          preview: rejectables.map((r) => ({
            projectId: r.projectId,
            createdAt: r.createdAtIso,
            keptProjectId: r.keptProjectId,
            keptCreatedAt: r.keptCreatedAtIso,
            title: r.title,
            groupNumber: r.groupNumber,
          })),
        },
      });
    }

    const now = new Date();
    const userId = session.user.id;

    const updates = rejectables.flatMap((r) => {
      const reason = formatDuplicateReason({
        keptProjectId: r.keptProjectId,
        keptCreatedAtIso: r.keptCreatedAtIso,
        rejectedCreatedAtIso: r.createdAtIso,
      });

      return [
        prisma.projectStatus.update({
          where: { content_id: r.contentId },
          data: {
            approved_status: ProjectApprovalStatus.REJECTED,
            rejected_reason: reason,
            approved_by_userId: userId,
            approved_at: now,
          },
        }),
        prisma.projectMetadata.update({
          where: { project_id: r.projectId },
          data: { featured: false },
        }),
      ];
    });

    await prisma.$transaction(updates);

    // Send rejection emails in the background (do not await)
    for (const r of rejectables) {
      if (!r.teamEmail || !r.title || !r.groupNumber) continue;

      const reason = formatDuplicateReason({
        keptProjectId: r.keptProjectId,
        keptCreatedAtIso: r.keptCreatedAtIso,
        rejectedCreatedAtIso: r.createdAtIso,
      });

      void sendEmail({
        to: r.teamEmail,
        subject: `Your SDGP Project "${r.title}" has been REJECTED`,
        html: rejectedTemplate({ group_num: r.groupNumber, title: r.title, reason }),
      }).catch((err) => console.error("Failed to send duplicate rejection email (silent):", err));
    }

    return NextResponse.json({
      success: true,
      message: `Rejected ${rejectables.length} duplicate submissions. Kept ${groups.length} most recent submissions for review.`,
      data: {
        rejected: rejectables.length,
        kept: groups.length,
        groups: groups.length,
        dryRun,
        rejectedProjectIds: rejectables.map((r) => r.projectId),
        keptProjectIds: groups.map((g) => g.keep.projectId),
      },
    });
  } catch (error: any) {
    console.error("Error bulk rejecting duplicate pending projects:", error);
    return NextResponse.json(
      {
        error: "Failed to bulk reject duplicate projects",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
