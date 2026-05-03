import { NextResponse } from "next/server";
import {prisma} from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    // Get counts for each status type
    const approvedCount = await prisma.projectStatus.count({
      where: {
        approved_status: ProjectApprovalStatus.APPROVED
      }
    });
    
    const pendingCount = await prisma.projectStatus.count({
      where: {
        approved_status: ProjectApprovalStatus.PENDING
      }
    });
    
    const rejectedCount = await prisma.projectStatus.count({
      where: {
        approved_status: ProjectApprovalStatus.REJECTED
      }
    });
    
    return NextResponse.json({
      approvedCount,
      pendingCount,
      rejectedCount
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project status counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch project status counts" },
      { status: 500 }
    );
  }
}
