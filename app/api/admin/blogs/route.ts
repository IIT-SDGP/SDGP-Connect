// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";
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
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10"), 1);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build filter conditions
    const whereClause: any = {};

    // Filter by approval status
    if (status === "pending") {
      whereClause.approved = false;
      whereClause.rejectedById = null;
    } else if (status === "approved") {
      whereClause.approved = true;
    } else if (status === "rejected") {
      whereClause.approved = false;
      whereClause.rejectedById = { not: null };
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { author: { name: { contains: search }} },
        { author: { email: { contains: search} }},
      ];
    }

    // Execute queries in parallel
    const [blogs, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          author: true,          approvedBy: {
            select: {
              user_id: true,
              name: true,
            },
          },
          rejectedBy: {
            select: {
              user_id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      blogs,
      total: totalCount,
      page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
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
    const body = await req.json();
    const { action, blogIds } = body;

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let updateData: any = {};
    
    if (action === "approve") {      updateData = {
        approved: true,
        approvedById: session.user.id,
        rejectedById: null,
        rejectedReason: null,
      };
    } else if (action === "reject") {
      const { reason } = body;
      if (!reason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 }
        );
      }      updateData = {
        approved: false,
        rejectedById: session.user.id,
        rejectedReason: reason,
        approvedById: null,
      };
    } else if (action === "feature" || action === "unfeature") {
      updateData = {
        featured: action === "feature",
      };
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const updatedBlogs = await prisma.blogPost.updateMany({
      where: {
        id: { in: blogIds },
      },
      data: updateData,
    });

    return NextResponse.json({
      message: `Successfully ${action}d ${updatedBlogs.count} blog post(s)`,
      count: updatedBlogs.count,
    });
  } catch (error) {
    console.error("Error updating blogs:", error);
    return NextResponse.json(
      { error: "Failed to update blogs" },
      { status: 500 }
    );
  }
};
