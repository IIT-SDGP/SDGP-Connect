import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

import { ProjectApprovalStatus } from "@prisma/client";
import { prisma } from "@/prisma/prismaClient";
import { approvedTemplate } from "@/lib/email/templates/approved";
import { enqueueEmail } from "@/lib/email/outbox";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user;
  if (!["ADMIN", "MODERATOR", ].includes(role)) {
    return NextResponse.json(
      { error: "Forbidden. You don't have required Permission" },
      { status: 403 }
    );
  }

    // Expect metadata IDs (project_id from ProjectMetadata)
    const { projectIds } = await req.json();
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { message: "Invalid request: projectIds must be a non-empty array" },
        { status: 400 }
      );
    }
    const userId = (session.user as any).id as string;

    // 1) Map metadata IDs → content_ids
    const contents = await prisma.projectContent.findMany({
      where: { metadata_id: { in: projectIds } },
      select: { content_id: true }
    });
    const contentIds = contents.map(c => c.content_id);

    // 2) Fetch only those statuses still PENDING
    const statuses = await prisma.projectStatus.findMany({
      where: {
        content_id: { in: contentIds },
        approved_status: ProjectApprovalStatus.PENDING
      }
    });

    // 3) Detect any missing/invalid IDs
    if (statuses.length !== contentIds.length) {
      const found = new Set(statuses.map(s => s.content_id));
      const missing = contentIds.filter(id => !found.has(id));
      return NextResponse.json(
        {
          message: "Some projects not found or not in PENDING status",
          notFoundContentIds: missing
        },
        { status: 404 }
      );
    }

    // 4) Approve all in one transaction
    const updated = await prisma.$transaction(
      statuses.map(s =>
        prisma.projectStatus.update({
          where: { content_id: s.content_id },
          data: {
            approved_status: ProjectApprovalStatus.APPROVED,
            approved_at: new Date(),
            approved_by_userId: userId
          }
        })
      )
    );

    // 5) Fetch metadata and details for all approved projects
    const approvedContentIds = statuses.map(s => s.content_id);
    const approvedContents = await prisma.projectContent.findMany({
      where: { content_id: { in: approvedContentIds } },
      include: {
        metadata: true,
        projectDetails: true
      }
    });

    // 6) Send approval emails in the background (do not await)
    for (const content of approvedContents) {
      const title = content.metadata?.title;
      const group_num = content.metadata?.group_num;
      const projectId = content.metadata?.project_id;
      const teamEmail = content.projectDetails?.team_email;
      if (title && group_num && projectId && teamEmail) {
        enqueueEmail({
          type: "PROJECT_APPROVED",
          to: teamEmail,
          subject: `Your project "${title}" has been approved!`,
          html: approvedTemplate({ group_num, title, projectId }),
          meta: { projectId: String(projectId) },
        }).catch((err) => console.error("Failed to queue approval email:", err));
      }
    }

    return NextResponse.json({
      message: `Successfully approved ${updated.length} projects`,
      updatedProjects: updated
    });
  } catch (error: any) {
    console.error("Error bulk approving projects:", error);
    return NextResponse.json(
      { message: error.message || "Failed to approve projects" },
      { status: 500 }
    );
  }
}
