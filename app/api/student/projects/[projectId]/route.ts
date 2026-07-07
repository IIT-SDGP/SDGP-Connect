// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { ProjectEditStatus, ProjectApprovalStatus } from "@prisma/client";
import { Role, AssociationType, ProjectStatusEnum } from "@/types/prisma-types";
import { buildLiveSnapshotFromDb, normalizeSnapshotForStorage } from "@/lib/project-edits/projectEditUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
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

    const { projectId } = await params;
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projectMetadata = await prisma.projectMetadata.findUnique({
      where: { project_id: projectId },
      include: {
        projectContent: {
          include: {
            projectDetails: true,
            status: {
              include: {
                approved_by: true,
              },
            },
            associations: true,
            slides: { orderBy: { createdAt: "asc" } },
            team: { orderBy: { createdAt: "asc" } },
            socialLinks: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!projectMetadata || projectMetadata.owner_userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (
      !projectMetadata.projectContent ||
      !projectMetadata.projectContent.projectDetails ||
      !projectMetadata.projectContent.status
    ) {
      return NextResponse.json({ error: "Project data is incomplete" }, { status: 500 });
    }

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
      status: { status: projectMetadata.projectContent.status.status as ProjectStatusEnum },
      projectDetails: projectMetadata.projectContent.projectDetails,
      associations: projectMetadata.projectContent.associations.map((a) => ({
        type: a.type as AssociationType,
        domain: a.domain,
        projectType: a.projectType,
        sdgGoal: a.sdgGoal,
        techStack: a.techStack,
      })),
      team: projectMetadata.projectContent.team.map((t) => ({
        name: t.name,
        linkedin_url: t.linkedin_url,
        profile_image: t.profile_image,
      })),
      socialLinks: projectMetadata.projectContent.socialLinks.map((s) => ({
        link_name: s.link_name,
        url: s.url,
      })),
      slides: projectMetadata.projectContent.slides.map((sl) => ({
        slides_content: sl.slides_content,
      })),
    });

    const liveSnapshotNormalized = normalizeSnapshotForStorage(liveSnapshot);

    const pendingEdit = await prisma.projectEdit.findFirst({
      where: {
        project_id: projectMetadata.project_id,
        status: ProjectEditStatus.PENDING,
      },
      select: {
        id: true,
        status: true,
        base_content_id: true,
        draft_snapshot: true,
        changes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      live: liveSnapshotNormalized,
      pendingEdit: pendingEdit
        ? {
          id: pendingEdit.id,
          status: pendingEdit.status,
          baseContentId: pendingEdit.base_content_id,
          draftSnapshot: pendingEdit.draft_snapshot,
          changes: pendingEdit.changes,
          createdAt: pendingEdit.createdAt,
          updatedAt: pendingEdit.updatedAt,
        }
        : null,
      approvalStatus: projectMetadata.projectContent.status.approved_status,
      memberIds: [projectMetadata.owner_userId],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch student project edit data", details: message },
      { status: 500 }
    );
  }
}