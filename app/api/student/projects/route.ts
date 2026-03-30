import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus } from "@prisma/client";
import { Role } from "@/types/prisma-types";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any)?.role as Role | undefined;
    if (role !== Role.STUDENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const skip = (page - 1) * limit;

    const total = await prisma.projectMetadata.count({
      where: { owner_userId: userId },
    });

    const projects = await prisma.projectMetadata.findMany({
      where: { owner_userId: userId },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        projectContent: {
          include: {
            status: true,
          },
        },
      },
    });

    const projectIds = projects.map((p) => p.project_id);
    const pendingEdits = await prisma.projectEdit.findMany({
      where: {
        project_id: { in: projectIds.length ? projectIds : ["__none__"] },
        status: ProjectEditStatus.PENDING,
      },
      select: { project_id: true },
    });

    const pendingSet = new Set(pendingEdits.map((e) => e.project_id));

    const data = projects.map((p) => ({
      projectId: p.project_id,
      title: p.title,
      groupNum: p.group_num,
      year: p.sdgp_year,
      approvalStatus: p.projectContent?.status?.approved_status ?? null,
      pendingEdit: pendingSet.has(p.project_id),
    }));

    return NextResponse.json({
      data,
      metadata: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Failed to fetch student projects", details: message }, { status: 500 });
  }
}