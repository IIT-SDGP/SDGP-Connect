import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { Role } from "@/types/prisma-types";

const activityLabels: Record<string, string> = {
  PROJECT_SUBMITTED: "Submitted",
  PROJECT_REJECTED: "Rejected",
  PROJECT_RESUBMITTED: "Resubmitted",
  PROJECT_APPROVED: "Approved",
  PROJECT_FEATURED: "Featured",
  EDIT_SUBMITTED: "Edit Submitted",
  EDIT_UPDATED: "Edit Updated",
  EDIT_APPROVED: "Edit Approved",
  EDIT_REJECTED: "Edit Rejected",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== Role.STUDENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectActivities = await prisma.projectActivity.findMany({
      where: {
        project: {
          owner_userId: userId,
        },
      },
      include: {
        actor: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const activities = projectActivities.map((item) => ({
      id: item.id,
      projectTitle: item.project.title,
      groupNumber: item.project.group_num,
      lastUpdated: item.createdAt.toISOString(),
      actionType: activityLabels[item.type] ?? item.type,
      actionBy: item.actor_userId === userId ? "You" : item.actor?.name || "Moderator",
      note: item.message,
    }));

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
