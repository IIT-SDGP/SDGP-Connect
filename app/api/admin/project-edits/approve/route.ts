import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import {
  AssociationType,
  ProjectEditStatus,
  ProjectApprovalStatus,
  SocialTypeEnum,
  ProjectStatusEnum,
} from "@prisma/client";
import { Role } from "@/types/prisma-types";
import { revalidatePath } from "next/cache";
import { getModuleFromYear } from "@/lib/utils/module";
import { buildLiveSnapshotFromDb } from "@/lib/project-edits/projectEditUtils";

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

  const { editId } = (await request.json()) as { editId?: string };
  if (!editId) {
    return NextResponse.json({ error: "editId is required" }, { status: 400 });
  }

  const edit = await prisma.projectEdit.findUnique({
    where: { id: editId },
  });

  if (!edit) {
    return NextResponse.json({ error: "Edit not found" }, { status: 404 });
  }

  if (edit.status !== ProjectEditStatus.PENDING) {
    return NextResponse.json(
      {
        error: "Edit is not pending",
        status: edit.status,
      },
      { status: 409 }
    );
  }

  const projectMetadata = await prisma.projectMetadata.findUnique({
    where: { project_id: edit.project_id },
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

  if (!projectMetadata?.projectContent?.status) {
    return NextResponse.json({ error: "Project data incomplete" }, { status: 500 });
  }

  const content = projectMetadata.projectContent;
  const liveStatus = content.status!;

  const liveApprovedStatus = liveStatus.approved_status;
  // We keep the approved_by/approved_at metadata as-is, so this should remain APPROVED.
  if (liveApprovedStatus !== ProjectApprovalStatus.APPROVED) {
    return NextResponse.json(
      { error: "Live project is not approved", status: liveApprovedStatus },
      { status: 409 }
    );
  }

  // Conflict detection: base_content_id must match current live content_id.
  if (edit.base_content_id && edit.base_content_id !== content.content_id) {
    return NextResponse.json(
      {
        error: "Conflict: project content changed since edit draft",
        code: "EDIT_CONFLICT",
        baseContentId: edit.base_content_id,
        liveContentId: content.content_id,
      },
      { status: 409 }
    );
  }

  // Apply the draft snapshot to live content.
  const draft = edit.draft_snapshot as any;

  const normalizedModule = getModuleFromYear(draft.metadata?.sdgp_year);

  const domains: string[] = Array.isArray(draft.domains) ? draft.domains : [];
  const projectTypes: string[] = Array.isArray(draft.projectTypes) ? draft.projectTypes : [];
  const sdgGoals: string[] = Array.isArray(draft.sdgGoals) ? draft.sdgGoals : [];
  const techStack: string[] = Array.isArray(draft.techStack) ? draft.techStack : [];

  const team: Array<{ name: string; linkedin_url?: string; profile_image?: string | null }> = Array.isArray(draft.team)
    ? draft.team
    : [];
  const socialLinks: Array<{ link_name: string; url: string }> = Array.isArray(draft.socialLinks) ? draft.socialLinks : [];
  const slides: Array<{ slides_content: string }> = Array.isArray(draft.slides) ? draft.slides : [];

  const newProjectStatus: ProjectStatusEnum = draft.status?.status ?? liveStatus.status;

  await prisma.$transaction(async (tx) => {
    // Update core metadata fields (do NOT change approval metadata).
    await tx.projectMetadata.update({
      where: { project_id: projectMetadata.project_id },
      data: {
        title: draft.metadata?.title ?? projectMetadata.title,
        subtitle: draft.metadata?.subtitle ?? null,
        website: draft.metadata?.website ?? null,
        cover_image: draft.metadata?.cover_image ?? null,
        logo: draft.metadata?.logo ?? null,
        module: normalizedModule,
      },
    });

    // Update project details
    await tx.projectDetails.update({
      where: { content_id: content.content_id },
      data: {
        problem_statement: draft.projectDetails?.problem_statement ?? "",
        solution: draft.projectDetails?.solution ?? "",
        features: draft.projectDetails?.features ?? "",
        team_email: draft.projectDetails?.team_email ?? "",
        team_phone: draft.projectDetails?.team_phone ?? "",
      },
    });

    // Update ProjectStatus.status (keep approved_status unchanged)
    await tx.projectStatus.update({
      where: { content_id: content.content_id },
      data: {
        status: newProjectStatus,
      },
    });

    // Replace associations (only the ones managed by project submissions/edits)
    await tx.projectAssociation.deleteMany({
      where: {
        content_id: content.content_id,
        type: {
          in: [
            AssociationType.PROJECT_DOMAIN,
            AssociationType.PROJECT_TYPE,
            AssociationType.PROJECT_SDG,
            AssociationType.PROJECT_TECH,
          ],
        },
      },
    });

    const associationCreates: any[] = [];
    for (const d of domains) {
      associationCreates.push({
        content_id: content.content_id,
        type: AssociationType.PROJECT_DOMAIN,
        value: d,
        domain: d as any,
      });
    }
    for (const pt of projectTypes) {
      associationCreates.push({
        content_id: content.content_id,
        type: AssociationType.PROJECT_TYPE,
        value: pt,
        projectType: pt as any,
      });
    }
    for (const sdg of sdgGoals) {
      associationCreates.push({
        content_id: content.content_id,
        type: AssociationType.PROJECT_SDG,
        value: sdg,
        sdgGoal: sdg as any,
      });
    }
    for (const t of techStack) {
      associationCreates.push({
        content_id: content.content_id,
        type: AssociationType.PROJECT_TECH,
        value: t,
        techStack: t as any,
      });
    }

    if (associationCreates.length > 0) {
      await tx.projectAssociation.createMany({ data: associationCreates });
    }

    // Replace team
    await tx.projectTeam.deleteMany({ where: { content_id: content.content_id } });
    if (team.length > 0) {
      await tx.projectTeam.createMany({
        data: team.map((m) => ({
          content_id: content.content_id,
          name: m.name,
          linkedin_url: m.linkedin_url ?? null,
          profile_image: m.profile_image ?? null,
        })),
      });
    }

    // Replace social links
    await tx.projectSocialLink.deleteMany({ where: { content_id: content.content_id } });
    if (socialLinks.length > 0) {
      await tx.projectSocialLink.createMany({
        data: socialLinks.map((s) => ({
          content_id: content.content_id,
          link_name: s.link_name as SocialTypeEnum,
          url: s.url,
        })),
      });
    }

    // Replace slides
    await tx.projectSlide.deleteMany({ where: { content_id: content.content_id } });
    if (slides.length > 0) {
      await tx.projectSlide.createMany({
        data: slides.map((sl) => ({
          content_id: content.content_id,
          slides_content:
            typeof sl.slides_content === "string"
              ? sl.slides_content.substring(0, 65535)
              : JSON.stringify(sl.slides_content).substring(0, 65535),
        })),
      });
    }

    // Mark the edit as approved
    await tx.projectEdit.update({
      where: { id: edit.id },
      data: {
        status: ProjectEditStatus.APPROVED,
        reviewed_by_userId: reviewerId,
        reviewed_at: new Date(),
        rejected_reason: null,
      },
    });
  });

  // Cache revalidation (best-effort)
  revalidatePath("/project");
  revalidatePath("/(public)/project");

  return NextResponse.json({ success: true, message: "Edit approved successfully" });
}