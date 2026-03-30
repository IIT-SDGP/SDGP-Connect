import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus } from "@prisma/client";
import { Role } from "@/types/prisma-types";
import { enqueueEmail } from "@/lib/email/outbox";
import { rejectedTemplate } from "@/lib/email/templates/rejected";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role as Role | undefined;
  if (!role || !["ADMIN", "MODERATOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reviewerId = (session.user as any).id as string | undefined;
  if (!reviewerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { editId, reason } = (await request.json()) as {
    editId?: string;
    reason?: string;
  };

  if (!editId) {
    return NextResponse.json({ error: "editId is required" }, { status: 400 });
  }
  if (!reason?.trim()) {
    return NextResponse.json({ error: "A rejection reason is required" }, { status: 400 });
  }

  const edit = await prisma.projectEdit.findUnique({
    where: { id: editId },
    include: {
      project: {
        include: {
          projectContent: {
            include: {
              projectDetails: true,
            },
          },
        },
      },
    },
  });

  if (!edit) {
    return NextResponse.json({ error: "Edit not found" }, { status: 404 });
  }

  if (edit.status !== ProjectEditStatus.PENDING) {
    return NextResponse.json({ error: "Edit is not pending", status: edit.status }, { status: 409 });
  }

  const teamEmail = edit.project.projectContent?.projectDetails?.team_email;
  const groupNum = edit.project.group_num;
  const title = edit.project.title;

  await prisma.projectEdit.update({
    where: { id: edit.id },
    data: {
      status: ProjectEditStatus.REJECTED,
      reviewed_by_userId: reviewerId,
      reviewed_at: new Date(),
      rejected_reason: reason,
    },
  });

  // Best-effort notification.
  try {
    if (teamEmail && title && groupNum) {
      void enqueueEmail({
        type: "PROJECT_EDIT_REJECTED",
        to: teamEmail,
        subject: `Your SDGP project edit was rejected: "${title}"`,
        html: rejectedTemplate({ group_num: groupNum, title, reason }),
        meta: { projectId: edit.project_id, editId: edit.id, reason },
      }).catch((err) => console.error("Failed to enqueue edit rejection email:", err));
    }
  } catch (err) {
    console.error("Failed to prepare edit rejection email:", err);
  }

  revalidatePath("/project");
  revalidatePath("/(public)/project");

  return NextResponse.json({ success: true, message: "Edit rejected successfully" });
}