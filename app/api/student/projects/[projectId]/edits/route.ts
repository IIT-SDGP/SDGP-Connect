// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus, ProjectApprovalStatus, SocialTypeEnum } from "@prisma/client";
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

  // Ownership + review-state check
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

  if (
    projectStatus.approved_status !== ProjectApprovalStatus.APPROVED &&
    projectStatus.approved_status !== ProjectApprovalStatus.REJECTED
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Edit locked for your project",
        code: "EDIT_LOCKED",
        details: `Your project is currently ${projectStatus.approved_status}. Wait for review before submitting edits.`,
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
  const baseContentId = projectContent.content_id;

  if (projectStatus.approved_status === ProjectApprovalStatus.REJECTED) {
    const draft = draftSnapshotNormalized;
    const domains = Array.isArray(draft.domains) ? draft.domains : [];
    const projectTypes = Array.isArray(draft.projectTypes) ? draft.projectTypes : [];
    const sdgGoals = Array.isArray(draft.sdgGoals) ? draft.sdgGoals : [];
    const techStack = Array.isArray(draft.techStack) ? draft.techStack : [];
    const team = Array.isArray(draft.team) ? draft.team : [];
    const socialLinks = Array.isArray(draft.socialLinks) ? draft.socialLinks : [];
    const slides = Array.isArray(draft.slides) ? draft.slides : [];

    await prisma.$transaction(async (tx) => {
      await tx.projectMetadata.update({
        where: { project_id: projectMetadata.project_id },
        data: {
          title: draft.metadata.title,
          subtitle: draft.metadata.subtitle || null,
          website: draft.metadata.website || null,
          cover_image: draft.metadata.cover_image || null,
          logo: draft.metadata.logo || null,
          module: draft.metadata.module,
          featured: false,
        },
      });

      await tx.projectDetails.update({
        where: { content_id: baseContentId },
        data: {
          problem_statement: draft.projectDetails.problem_statement,
          solution: draft.projectDetails.solution,
          features: draft.projectDetails.features,
          team_email: draft.projectDetails.team_email,
          team_phone: draft.projectDetails.team_phone || "",
        },
      });

      await tx.projectStatus.update({
        where: { content_id: baseContentId },
        data: {
          status: draft.status.status,
          approved_status: ProjectApprovalStatus.PENDING,
          rejected_reason: null,
          approved_by_userId: null,
          approved_at: null,
        },
      });

      await tx.projectActivity.create({
        data: {
          project_id: projectMetadata.project_id,
          actor_userId: userId,
          type: "PROJECT_RESUBMITTED",
        },
      });

      await tx.projectAssociation.deleteMany({
        where: {
          content_id: baseContentId,
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

      const associationCreates: any[] = [
        ...domains.map((domain) => ({
          content_id: baseContentId,
          type: AssociationType.PROJECT_DOMAIN,
          value: domain,
          domain,
        })),
        ...projectTypes.map((projectType) => ({
          content_id: baseContentId,
          type: AssociationType.PROJECT_TYPE,
          value: projectType,
          projectType,
        })),
        ...sdgGoals.map((sdgGoal) => ({
          content_id: baseContentId,
          type: AssociationType.PROJECT_SDG,
          value: sdgGoal,
          sdgGoal,
        })),
        ...techStack.map((tech) => ({
          content_id: baseContentId,
          type: AssociationType.PROJECT_TECH,
          value: tech,
          techStack: tech,
        })),
      ];

      if (associationCreates.length > 0) {
        await tx.projectAssociation.createMany({ data: associationCreates });
      }

      await tx.projectTeam.deleteMany({ where: { content_id: baseContentId } });
      if (team.length > 0) {
        await tx.projectTeam.createMany({
          data: team.map((member) => ({
            content_id: baseContentId,
            name: member.name,
            linkedin_url: member.linkedin_url || null,
            profile_image: member.profile_image || null,
          })),
        });
      }

      await tx.projectSocialLink.deleteMany({ where: { content_id: baseContentId } });
      if (socialLinks.length > 0) {
        await tx.projectSocialLink.createMany({
          data: socialLinks.map((link) => ({
            content_id: baseContentId,
            link_name: link.link_name as SocialTypeEnum,
            url: link.url,
          })),
        });
      }

      await tx.projectSlide.deleteMany({ where: { content_id: baseContentId } });
      if (slides.length > 0) {
        await tx.projectSlide.createMany({
          data: slides.map((slide) => ({
            content_id: baseContentId,
            slides_content:
              typeof slide.slides_content === "string"
                ? slide.slides_content.substring(0, 65535)
                : JSON.stringify(slide.slides_content).substring(0, 65535),
          })),
        });
      }
    });

    return NextResponse.json({
      success: true,
      mode: "RESUBMITTED_REJECTED_PROJECT",
      projectId: projectMetadata.project_id,
    });
  }

  // One pending edit per project: update existing pending request or create a new one.
  const existingPending = await prisma.projectEdit.findFirst({
    where: { project_id: projectMetadata.project_id, status: ProjectEditStatus.PENDING },
    select: { id: true },
  });

  if (existingPending) {
    await prisma.$transaction([
      prisma.projectEdit.update({
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
      }),
      prisma.projectActivity.create({
        data: {
          project_id: projectMetadata.project_id,
          actor_userId: userId,
          type: "EDIT_UPDATED",
          metadata: {
            editId: existingPending.id,
          },
        },
      }),
    ]);
  } else {
    const created = await prisma.$transaction(async (tx) => {
      const edit = await tx.projectEdit.create({
        data: {
          project_id: projectMetadata.project_id,
          created_by_userId: userId,
          status: ProjectEditStatus.PENDING,
          base_content_id: baseContentId,
          draft_snapshot: draftSnapshotNormalized as any,
          changes: changes as any,
        },
      });

      await tx.projectActivity.create({
        data: {
          project_id: projectMetadata.project_id,
          actor_userId: userId,
          type: "EDIT_SUBMITTED",
          metadata: {
            editId: edit.id,
          },
        },
      });

      return edit;
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
