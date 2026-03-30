import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectApprovalStatus } from "@prisma/client";
import { prisma } from "@/prisma/prismaClient";
import { sendEmail } from "@/lib/email";
import { approvedTemplate } from "@/lib/email/templates/approved";

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
   

    const { projectId, featured, title, groupNumber, teamEmail } = await request.json();
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 }
      );
    }

    // verify project exists
    const projectMetadata = await prisma.projectMetadata.findUnique({
      where: { project_id: String(projectId) }
    });
    if (!projectMetadata) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    // load its content + status
    const projectContent = await prisma.projectContent.findUnique({
      where: { metadata_id: String(projectId) },
      include: { status: true }
    });
    if (!projectContent) {
      return NextResponse.json(
        { error: "Project content not found." },
        { status: 404 }
      );
    }

    // conflict if already approved
    if (
      projectContent.status?.approved_status ===
      ProjectApprovalStatus.APPROVED
    ) {
      return NextResponse.json(
        {
          error: "Already approved",
          status: "ALREADY_APPROVED",
          approvedBy: projectContent.status.approved_by_userId,
          approvedAt: projectContent.status.approved_at,
        },
        { status: 409 }
      );
    }    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Update status with the session.user.id, but only if user exists
    const updatedStatus = await prisma.projectStatus.update({
      where: { content_id: projectContent.content_id },
      data: {
        approved_status: ProjectApprovalStatus.APPROVED,
        approved_at: new Date(),
        ...(user ? { approved_by_userId: userId } : {})
      },
    });

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

   if (teamEmail && title && groupNumber) {
  try {
    await sendEmail({
      to: teamEmail,
      subject: `Your SDGP project "${title}" has been approved!`,
      html: approvedTemplate({ group_num: groupNumber, title, projectId }),
    });

  } catch (err) {
    console.error("Failed to send approval email:", err);
  }
}

    return NextResponse.json({
      success: true,
      message: "Project approved successfully",
      data: {
        projectId,
        featured,
        approvedAt: updatedStatus.approved_at,
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
