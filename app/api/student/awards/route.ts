import { NextResponse } from "next/server";

import { prisma } from "@/prisma/prismaClient";
import { getStudentSessionUser } from "@/lib/student-dashboard/session";
import { ApprovalStatus } from "@/types/prisma-types";
import { awardPayloadSchema } from "@/validations/award";

function applyAwardStatusFilter(where: Record<string, unknown>, status: string | null) {
  if (status === "pending") {
    where.approval_status = ApprovalStatus.PENDING;
  } else if (status === "approved") {
    where.approval_status = ApprovalStatus.APPROVED;
  } else if (status === "rejected") {
    where.approval_status = ApprovalStatus.REJECTED;
  }
}

async function ensureOwnedProject(projectId: string, userId: string) {
  return prisma.projectMetadata.findFirst({
    where: {
      project_id: projectId,
      owner_userId: userId,
    },
    select: {
      project_id: true,
    },
  });
}

export async function GET(request: Request) {
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "20", 10), 1);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      project: {
        is: {
          owner_userId: auth.user.id,
        },
      },
    };

    applyAwardStatusFilter(where, status);

    const [total, awards] = await Promise.all([
      prisma.award.count({ where }),
      prisma.award.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          competition: true,
          project: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: awards,
      metadata: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch student awards", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validatedData = awardPayloadSchema.parse(body);

    const ownedProject = await ensureOwnedProject(validatedData.projectId, auth.user.id);
    if (!ownedProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const competition = await prisma.competition.findUnique({
      where: { id: validatedData.competitionId },
      select: { id: true },
    });

    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const award = await prisma.award.create({
      data: {
        name: validatedData.awardName,
        image: validatedData.image,
        competition_id: validatedData.competitionId,
        project_id: validatedData.projectId,
        approval_status: ApprovalStatus.PENDING,
        accepted_by_id: null,
        rejected_by_id: null,
        rejected_reason: null,
      },
      include: {
        competition: true,
        project: true,
      },
    });

    return NextResponse.json({ data: award }, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create student award", details: message },
      { status: 500 }
    );
  }
}
