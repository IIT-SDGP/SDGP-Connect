// app/api/admin/dashboard/activity/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    // Combine data from multiple sources for activities
    // 1. Get approved/rejected projects
    const statusActivities = await prisma.projectStatus.findMany({
      where: {
        approved_status: {
          in: [ProjectApprovalStatus.APPROVED, ProjectApprovalStatus.REJECTED]
        },
      },
      include: {
        approved_by: true,
        content: {
          include: {
            metadata: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });
    
    // 2. Get featured projects
    const featuredActivities = await prisma.projectMetadata.findMany({
      where: {
        featured: true,
        featured_by_userId: { not: null }
      },
      include: {
        featured_by: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });
    
    // 3. Get recently submitted projects (pending approval)
    const submittedActivities = await prisma.projectStatus.findMany({
      where: {
        approved_status: ProjectApprovalStatus.PENDING
      },
      include: {
        content: {
          include: {
            metadata: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    });
    
    // Format the data from status activities
    const formattedStatusActivities = statusActivities.map(item => ({
      id: item.content_id,
      projectTitle: item.content.metadata.title,
      groupNumber: item.content.metadata.group_num,
      lastUpdated: item.updatedAt.toISOString(),
      actionType: item.approved_status === ProjectApprovalStatus.APPROVED ? 'Approved' : 'Rejected',
      actionBy: item.approved_by?.name || 'Unknown'
    }));
    
    // Format the data from featured activities
    const formattedFeaturedActivities = featuredActivities.map(item => ({
      id: item.project_id,
      projectTitle: item.title,
      groupNumber: item.group_num,
      lastUpdated: item.updatedAt.toISOString(),
      actionType: 'Featured',
      actionBy: item.featured_by?.name || 'Unknown'
    }));
    
    // Format the data from submitted activities
    const formattedSubmittedActivities = submittedActivities.map(item => ({
      id: item.content_id,
      projectTitle: item.content.metadata.title,
      groupNumber: item.content.metadata.group_num, 
      lastUpdated: item.createdAt.toISOString(),
      actionType: 'Submitted',
      actionBy: 'User' // Since we don't have user submission info in the schema
    }));
    
    // Combine all activities
    const allActivities = [
      ...formattedStatusActivities,
      ...formattedFeaturedActivities,
      ...formattedSubmittedActivities
    ];
    
    // Sort by date (most recent first)
    const sortedActivities = allActivities.sort((a, b) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
    
    // Return only the most recent activities (limit to 10)
    return NextResponse.json({
      activities: sortedActivities.slice(0, 10),
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
