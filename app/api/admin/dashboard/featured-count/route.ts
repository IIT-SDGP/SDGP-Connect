import { NextResponse } from "next/server";
import {prisma} from "@/prisma/prismaClient";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    const featuredCount = await prisma.projectMetadata.count({
      where: {
        featured: true
      }
    });
    
    return NextResponse.json({
      count: featuredCount,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching featured projects count:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects count" },
      { status: 500 }
    );
  }
}
