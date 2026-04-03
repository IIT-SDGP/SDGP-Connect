import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectApprovalStatus } from "@prisma/client";
import { prisma } from "@/prisma/prismaClient";
import { approvedTemplate } from "@/lib/email/templates/approved";
import { enqueueEmail } from "@/lib/email/outbox";

export async function POST(request: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Role-based authorization check
  const { role } = session.user;
  if (!["ADMIN", "MODERATOR",].includes(role)) {
    return NextResponse.json(
      { error: "Forbidden. You don't have required Permission" },
      { status: 403 }
    );
  }

  const userId = session.user.id;

  try {


    const { projectId, featured } = await request.json();
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    // load content + status + minimal details for email
    const projectContent = await prisma.projectContent.findFirst({
      where: { metadata_id: String(projectId) },
      include: {
        status: true,
        metadata: true,
        projectDetails: true,
      },
    });
    if (!projectContent) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    // Atomic state transition: allow re-opening REJECTED -> APPROVED as well.
    const now = new Date();
    const updated = await prisma.projectStatus.updateMany({
      where: {
        content_id: projectContent.content_id,
        approved_status: {
          in: [ProjectApprovalStatus.PENDING, ProjectApprovalStatus.REJECTED],
        },
      },
      data: {
        approved_status: ProjectApprovalStatus.APPROVED,
        approved_at: now,
        approved_by_userId: userId,
      },
    });

    if (updated.count === 0) {
      const current = await prisma.projectStatus.findUnique({
        where: { content_id: projectContent.content_id },
        select: {
          approved_status: true,
          approved_by_userId: true,
          approved_at: true,
        },
      });

      const alreadyApproved = current?.approved_status === ProjectApprovalStatus.APPROVED;
      return NextResponse.json(
        {
          error: alreadyApproved ? "Already approved" : "Already reviewed",
          status: alreadyApproved ? "ALREADY_APPROVED" : "ALREADY_REVIEWED",
          approvedBy: current?.approved_by_userId ?? null,
          approvedAt: current?.approved_at ?? null,
        },
        { status: 409 }
      );
    }

    // optionally mark featured
    if (featured) {
      await prisma.projectMetadata.update({
        where: { project_id: String(projectId) },
        data: {
          featured: true,
          featured_by_userId: userId,
        },
      });
    }

    // Send approval email (best-effort, do not block approval)
    try {
      const title = projectContent.metadata?.title;
      const groupNumber = projectContent.metadata?.group_num;
      const teamEmail = projectContent.projectDetails?.team_email;
      if (teamEmail && title && groupNumber) {
        void enqueueEmail({
          type: "PROJECT_APPROVED",
          to: teamEmail,
          subject: `Your SDGP project "${title}" has been approved!`,
          html: approvedTemplate({ group_num: groupNumber, title, projectId }),
          meta: { projectId: String(projectId) },
        }).catch((err) => console.error("Failed to queue approval email:", err));
      }
    } catch (err) {
      console.error("Failed to prepare approval email:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Project approved successfully",
      data: {
        projectId,
        featured,
        approvedAt: now,
        approvedBy: userId,
      },
    });
  } catch (error: any) {
    console.error("Error approving project:", error);
    return NextResponse.json(
      {
        error: "Failed to approve project",
        details: error.message,
      },
      { status: 500 }
    );
  }
}