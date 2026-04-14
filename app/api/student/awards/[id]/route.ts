import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ApprovalStatus, Role } from "@/types/prisma-types";
import { awardPayloadSchema } from "@/validations/award";

async function getOwnedAward(awardId: string, userId: string) {
  return prisma.award.findFirst({
    where: {
      id: awardId,
      project: {
        is: {
          owner_userId: userId,
        },
      },
    },
    include: {
      competition: true,
      project: true,
    },
  });
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const award = await getOwnedAward(id, userId);

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json({ data: award });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch student award", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const existing = await getOwnedAward(id, userId);

    if (!existing) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    if (existing.approval_status === ApprovalStatus.APPROVED) {
      return NextResponse.json(
        { error: "Approved awards cannot be edited from the student dashboard" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validatedData = awardPayloadSchema.parse(body);

    const ownedProject = await ensureOwnedProject(validatedData.projectId, userId);
    if (!ownedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const competition = await prisma.competition.findUnique({
      where: { id: validatedData.competitionId },
      select: { id: true },
    });

    if (!competition) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    }

    const updated = await prisma.award.update({
      where: { id },
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

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update student award", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const existing = await getOwnedAward(id, userId);

    if (!existing) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    if (existing.approval_status === ApprovalStatus.APPROVED) {
      return NextResponse.json(
        { error: "Approved awards cannot be deleted from the student dashboard" },
        { status: 409 }
      );
    }

    await prisma.award.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete student award", details: message },
      { status: 500 }
    );
  }
}
