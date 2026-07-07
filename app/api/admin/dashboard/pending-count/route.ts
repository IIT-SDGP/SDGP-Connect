import { NextResponse } from "next/server";
import {prisma} from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    const pendingCount = await prisma.projectStatus.count({
      where: {
        approved_status: ProjectApprovalStatus.PENDING
      }
    });
    
    return NextResponse.json({
      count: pendingCount,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending projects count:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending projects count" },
      { status: 500 }
    );
  }
}
