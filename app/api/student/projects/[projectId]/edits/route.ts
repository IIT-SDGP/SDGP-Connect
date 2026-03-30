import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus, ProjectApprovalStatus } from "@prisma/client";
import { Role, AssociationType, ProjectStatusEnum } from "@/types/prisma-types";
import { projectSubmissionSchema, type ProjectSubmissionSchema } from "@/validations/submit_project";
import {
  buildLiveSnapshotFromDb,
  normalizeSnapshotForStorage,
  computeSnapshotChanges,
} from "@/lib/project-edits/projectEditUtils";
import { getModuleFromYear } from "@/lib/utils/module";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
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

  const { projectId } = await params;
  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const validatedData = projectSubmissionSchema.parse(body) as ProjectSubmissionSchema;

  // Ownership + approved status check
  const projectMetadata = await prisma.projectMetadata.findUnique({
    where: { project_id: projectId },
    include: {
      projectContent: {
        include: {
          projectDetails: true,
          status: true,
          associations: true,
          slides: true,
          team: true,
          socialLinks: true,
        },
      },
    },
  });

  if (!projectMetadata || projectMetadata.owner_userId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectContent = projectMetadata.projectContent;
  const projectStatus = projectContent?.status;
  if (!projectContent || !projectStatus) {
    return NextResponse.json({ error: "Project data is incomplete" }, { status: 500 });
  }

  if (projectStatus.approved_status !== ProjectApprovalStatus.APPROVED) {
    return NextResponse.json(
      {
        success: false,
        message: "Edit locked for your project",
        code: "EDIT_LOCKED",
        details: `Your project is currently ${projectStatus.approved_status}. You can submit edits only after approval.`,
        data: {
          projectId: projectMetadata.project_id,
          status: projectStatus.approved_status,
        },
      },
      { status: 409 }
    );
  }

  // Build live snapshot for diffing.
  const liveSnapshot = buildLiveSnapshotFromDb({
    metadata: {
      sdgp_year: projectMetadata.sdgp_year,
      group_num: projectMetadata.group_num,
      title: projectMetadata.title,
      subtitle: projectMetadata.subtitle,
      website: projectMetadata.website,
      cover_image: projectMetadata.cover_image,
      logo: projectMetadata.logo,
    },
    status: { status: projectStatus.status as ProjectStatusEnum },
    projectDetails: projectContent.projectDetails,
    associations: projectContent.associations.map((a) => ({
      type: a.type as AssociationType,
      domain: a.domain,
      projectType: a.projectType,
      sdgGoal: a.sdgGoal,
      techStack: a.techStack,
    })),
    team: projectContent.team.map((t) => ({
      name: t.name,
      linkedin_url: t.linkedin_url,
      profile_image: t.profile_image,
    })),
    socialLinks: projectContent.socialLinks.map((s) => ({
      link_name: s.link_name,
      url: s.url,
    })),
    slides: projectContent.slides.map((sl) => ({
      slides_content: sl.slides_content,
    })),
  });

  const liveSnapshotNormalized = normalizeSnapshotForStorage(liveSnapshot);

  // Enforce sdgp_year/group_num read-only on the backend.
  validatedData.metadata.sdgp_year = liveSnapshotNormalized.metadata.sdgp_year;
  validatedData.metadata.group_num = liveSnapshotNormalized.metadata.group_num;
  validatedData.metadata.module = getModuleFromYear(liveSnapshotNormalized.metadata.sdgp_year);

  const draftSnapshotNormalized = normalizeSnapshotForStorage(validatedData);
  const changes = computeSnapshotChanges(liveSnapshotNormalized, draftSnapshotNormalized);

  // One pending edit per project: update existing pending request or create a new one.
  const existingPending = await prisma.projectEdit.findFirst({
    where: { project_id: projectMetadata.project_id, status: ProjectEditStatus.PENDING },
    select: { id: true },
  });

  const baseContentId = projectContent.content_id;

  if (existingPending) {
    await prisma.projectEdit.update({
      where: { id: existingPending.id },
      data: {
        draft_snapshot: draftSnapshotNormalized as any,
        changes: changes as any,
        base_content_id: baseContentId,
        status: ProjectEditStatus.PENDING,
        reviewed_by_userId: null,
        reviewed_at: null,
        rejected_reason: null,
      },
    });
  } else {
    const created = await prisma.projectEdit.create({
      data: {
        project_id: projectMetadata.project_id,
        created_by_userId: userId,
        status: ProjectEditStatus.PENDING,
        base_content_id: baseContentId,
        draft_snapshot: draftSnapshotNormalized as any,
        changes: changes as any,
      },
    });
    return NextResponse.json({ success: true, editId: created.id });
  }

  // Fetch id for response when updating.
  const updated = await prisma.projectEdit.findFirst({
    where: { project_id: projectMetadata.project_id, status: ProjectEditStatus.PENDING },
    select: { id: true },
  });

  return NextResponse.json({ success: true, editId: updated?.id });
}