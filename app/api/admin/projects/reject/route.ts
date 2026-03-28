// app/api/projects/reject/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectStatusEnum } from "@prisma/client";
import { ProjectApprovalStatus } from "@prisma/client";
import { rejectedTemplate } from "@/lib/email/templates/rejected";
import { enqueueEmail } from "@/lib/email/outbox";

export async function POST(request: NextRequest) {
  // 1) Get real session & enforce login
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized. You must be logged in to reject projects." },
      { status: 401 }
    );
  }

  // 2) Enforce role-based access
  const { role, id: userId } = session.user;
  if (!["ADMIN", "MODERATOR",].includes(role)) {
    return NextResponse.json(
      { error: "Forbidden. You don't have permission to reject projects." },
      { status: 403 }
    );
  }

  try {
    // 3) Parse body
    const { projectId, reason } = await request.json();
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }
    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "A reason for rejection is required." },
        { status: 400 }
      );
    }

    // 4) Lookup the project content + status
    const projectContent = await prisma.projectContent.findUnique({
      where: { metadata_id: String(projectId) },
      include: { status: true, projectDetails: true, metadata: true },
    });
    if (!projectContent) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    // 5) Prevent rejecting an already-rejected project
    if (projectContent.status?.approved_status === ProjectApprovalStatus.REJECTED) {
      return NextResponse.json(
        {
          error: "This project has already been rejected.",
          status: "ALREADY_REJECTED",
          rejectedReason: projectContent.status.rejected_reason,
        },
        { status: 409 }
      );
    }

    // 6) Reject the project and un-feature it atomically
    const [updatedStatus, updatedMetadata] = await prisma.$transaction([
      prisma.projectStatus.update({
        where: { content_id: projectContent.content_id },
        data: {
          approved_status: ProjectApprovalStatus.REJECTED,
          rejected_reason: reason,
          approved_by_userId: userId,
          approved_at: new Date(),
        },
      }),
      prisma.projectMetadata.update({
        where: { project_id: projectContent.metadata_id },
        data: { featured: false },
      }),
    ]);

    // 7) Send rejection email in background (do not await)
    try {
      const teamEmail = projectContent.projectDetails?.team_email;
      const groupNum = projectContent.metadata?.group_num;
      const title = projectContent.metadata?.title;
      if (teamEmail && groupNum && title) {
        void enqueueEmail({
          type: "PROJECT_REJECTED",
          to: teamEmail,
          subject: `Your SDGP Project "${title}" has been REJECTED`,
          html: rejectedTemplate({ group_num: groupNum, title, reason }),
          meta: { projectId: String(projectId), reason },
        }).catch(console.error);
      }
    } catch (e) {
      // fail silently
    }

    // 8) Return success
    return NextResponse.json({
      success: true,
      message: "Project rejected successfully",
      data: {
        projectId,
        reason,
        rejectedAt: updatedStatus.approved_at,
        rejectedBy: userId,
        featured: updatedMetadata.featured,
      },
    });
  } catch (error: any) {
    console.error("Error rejecting project:", error);
    return NextResponse.json(
      {
        error: "Failed to reject project",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
