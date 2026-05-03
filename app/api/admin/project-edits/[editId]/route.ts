import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { AssociationType, Role, ProjectStatusEnum } from "@/types/prisma-types";
import { buildLiveSnapshotFromDb, normalizeSnapshotForStorage } from "@/lib/project-edits/projectEditUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ editId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role as Role | undefined;
  if (!role || !["ADMIN", "MODERATOR"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { editId } = await params;
  if (!editId) {
    return NextResponse.json({ error: "Edit ID is required" }, { status: 400 });
  }

  const edit = await prisma.projectEdit.findUnique({
    where: { id: editId },
    include: {
      project: {
        include: {
          projectContent: {
            include: {
              projectDetails: true,
              status: true,
              associations: true,
              slides: { orderBy: { createdAt: "asc" } },
              team: { orderBy: { createdAt: "asc" } },
              socialLinks: { orderBy: { createdAt: "asc" } },
            },
          },
        },
      },
      created_by: { select: { id: true, name: true, email: true } },
    },
  });

  if (!edit) {
    return NextResponse.json({ error: "Edit not found" }, { status: 404 });
  }

  const p = edit.project;
  const content = p.projectContent;
  if (!content || !content.projectDetails || !content.status) {
    return NextResponse.json({ error: "Project data incomplete" }, { status: 500 });
  }

  const liveSnapshot = buildLiveSnapshotFromDb({
    metadata: {
      sdgp_year: p.sdgp_year,
      group_num: p.group_num,
      title: p.title,
      subtitle: p.subtitle,
      website: p.website,
      cover_image: p.cover_image,
      logo: p.logo,
    },
    status: { status: content.status.status as ProjectStatusEnum },
    projectDetails: content.projectDetails,
    associations: content.associations.map((a) => ({
      type: a.type as AssociationType,
      domain: a.domain,
      projectType: a.projectType,
      sdgGoal: a.sdgGoal,
      techStack: a.techStack,
    })),
    team: content.team.map((t) => ({
      name: t.name,
      linkedin_url: t.linkedin_url,
      profile_image: t.profile_image,
    })),
    socialLinks: content.socialLinks.map((s) => ({
      link_name: s.link_name,
      url: s.url,
    })),
    slides: content.slides.map((sl) => ({ slides_content: sl.slides_content })),
  });

  const liveSnapshotNormalized = normalizeSnapshotForStorage(liveSnapshot);

  return NextResponse.json({
    edit: {
      id: edit.id,
      projectId: edit.project_id,
      status: edit.status,
      baseContentId: edit.base_content_id,
      reviewedAt: edit.reviewed_at,
      rejectedReason: edit.rejected_reason,
      draftSnapshot: edit.draft_snapshot,
      changes: edit.changes,
      createdBy: edit.created_by,
      createdAt: edit.createdAt,
      updatedAt: edit.updatedAt,
    },
    live: liveSnapshotNormalized,
    liveBaseContentId: content.content_id,
    currentApprovedStatus: content.status.approved_status,
  });
}