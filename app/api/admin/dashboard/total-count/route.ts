import { NextResponse } from "next/server";
import {prisma} from "@/prisma/prismaClient";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    const totalCount = await prisma.projectMetadata.count();
    
    return NextResponse.json({
      count: totalCount,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total projects count:", error);
    return NextResponse.json(
      { error: "Failed to fetch total projects count" },
      { status: 500 }
    );
  }
}
