import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req: NextRequest) => {
  // Authentication check
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized. You must be logged in to access this resource." },
      { status: 401 }
    );
  }

  // Role-based authorization check
  const { role } = session.user;
  if (!["ADMIN", "MODERATOR", "DEVELOPER"].includes(role)) {
    return NextResponse.json(
      { error: "Forbidden. You don't have permission to access this resource." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    // Get query parameters with defaults
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(searchParams.get("limit") || "10"), 1); // Default 10 for admin
    const search = searchParams.get("search") || "";
    const statusType = searchParams.get("status") as ProjectApprovalStatus;
    const sortBy = (searchParams.get("sortBy") || "").trim();
    const sortDirParam = (searchParams.get("sortDir") || "desc").toLowerCase();
    const sortDir: "asc" | "desc" = sortDirParam === "asc" ? "asc" : "desc";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build filter conditions
    const whereClause: any = {};

    // If status is specified, filter by it
    if (statusType) {
      whereClause.status = {
        approved_status: statusType
      };
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { metadata: { title: { contains: search } } }
      ];
    }

    // Count total projects matching the criteria
    const totalProjects = await prisma.projectContent.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalProjects / limit);

    // Sorting (table header click)
    const buildOrderBy = () => {
      if (!sortBy) {
        return statusType === ProjectApprovalStatus.APPROVED
          ? [
              { metadata: { featured: "desc" as const } },
              { updatedAt: "desc" as const },
            ]
          : { updatedAt: "desc" as const };
      }

      switch (sortBy) {
        case "title":
          return { metadata: { title: sortDir } };
        case "groupNumber":
          return { metadata: { group_num: sortDir } };
        case "submissionDate":
          return { createdAt: sortDir };
        case "status":
          return { status: { status: sortDir } };
        case "featured":
          return { metadata: { featured: sortDir } };
        case "approvedAt":
        case "rejectedAt":
          return { status: { approved_at: sortDir } };
        case "approvedBy":
        case "rejectedBy":
          return { status: { approved_by: { name: sortDir } } };
        default:
          return statusType === ProjectApprovalStatus.APPROVED
            ? [
                { metadata: { featured: "desc" as const } },
                { updatedAt: "desc" as const },
              ]
            : { updatedAt: "desc" as const };
      }
    };

    // Fetch projects with pagination
    const projects = await prisma.projectContent.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: buildOrderBy(),
      include: {
        metadata: true,
        status: {
          include: {
            approved_by: {
              select: {
                user_id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Transform the projects into the required format for the admin dashboard
    const formattedProjects = projects.map((project: any) => {
      if (statusType === ProjectApprovalStatus.PENDING) {
        return {
          id: project.metadata.project_id,
          title: project.metadata.title,
          groupNumber: project.metadata.group_num,
          submissionDate: project.createdAt?.toISOString(),
          status: project?.status?.status,
        };
      }

      if (statusType === ProjectApprovalStatus.REJECTED) {
        return {
          id: project.metadata.project_id,
          title: project.metadata.title,
          groupNumber: project.metadata.group_num,
          rejectedBy: project?.status?.approved_by?.name || 'System',
          rejectedAt: project?.status?.approved_at?.toISOString() || '',
          rejectionReason: project?.status?.rejected_reason || '',
        };
      }

      if (statusType === ProjectApprovalStatus.APPROVED) {
        return {
          id: project.metadata.project_id,
          title: project.metadata.title,
          groupNumber: project.metadata.group_num,
          featured: project.metadata.featured,
          approvedBy: project?.status?.approved_by?.name || 'System',
          approvedAt: project?.status?.approved_at?.toISOString() || '',
        };
      }

      // Generic fallback
      return {
        id: project.metadata.project_id,
        title: project.metadata.title,
        groupNumber: project.metadata.group_num,
        status: project?.status?.approved_status,
      };
    });

    // Return the paginated response
    return NextResponse.json({
      data: formattedProjects,
      metadata: {
        currentPage: page,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
};
