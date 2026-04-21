// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ApprovalStatus, Role } from "@/types/prisma-types";
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

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "20", 10), 1);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      project: {
        is: {
          owner_userId: userId,
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
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          image: true,
          approval_status: true,
          rejected_reason: true,
          createdAt: true,
          project: {
            select: {
              project_id: true,
              title: true,
            },
          },
          competition: {
            select: {
              id: true,
              name: true,
            },
          },
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

  try {
    const body = await request.json();
    const validatedData = awardPayloadSchema.parse(body);

    const ownedProject = await ensureOwnedProject(validatedData.projectId, userId);
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
