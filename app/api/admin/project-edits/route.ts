import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus } from "@prisma/client";
import { Role } from "@/types/prisma-types";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role as Role | undefined;
  if (!role || !["ADMIN", "MODERATOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
  const skip = (page - 1) * limit;

  const statusParam = searchParams.get("status") as ProjectEditStatus | null;
  const search = (searchParams.get("search") || "").trim();

  const where: any = {};
  if (statusParam && [ProjectEditStatus.PENDING, ProjectEditStatus.APPROVED, ProjectEditStatus.REJECTED].includes(statusParam)) {
    where.status = statusParam;
  }
  if (search) {
    where.project = {
      title: { contains: search, mode: "insensitive" },
    };
  }

  const total = await prisma.projectEdit.count({ where });
  const edits = await prisma.projectEdit.findMany({
    where,
    take: limit,
    skip,
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { project_id: true, title: true, group_num: true, sdgp_year: true } },
      created_by: { select: { id: true, name: true, email: true } },
    },
  });

  const data = edits.map((e) => {
    const changesArray = Array.isArray(e.changes) ? e.changes : [];
    return {
      editId: e.id,
      projectId: e.project_id,
      projectTitle: e.project?.title,
      groupNum: e.project?.group_num,
      year: e.project?.sdgp_year,
      student: {
        id: e.created_by.id,
        name: e.created_by.name ?? e.created_by.email,
      },
      status: e.status,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      changesCount: changesArray.length,
    };
  });

  return NextResponse.json({
    data,
    metadata: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  });
}