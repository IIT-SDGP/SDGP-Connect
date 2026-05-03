import { prisma } from "@/prisma/prismaClient";
import { ApprovalStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";


export async function GET(req: NextRequest) {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ApprovalStatus;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  const where = {
    approval_status: status,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const [competitions, total] = await Promise.all([
    prisma.competition.findMany({
      where,
      orderBy: { start_date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        accepted_by: true,
        rejected_by: true,
      },
    }),
    prisma.competition.count({ where }),
  ]);

  return NextResponse.json({
    competitions,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  });
}
