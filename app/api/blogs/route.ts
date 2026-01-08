// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { ProjectDomainEnum } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const excludeFeatured = searchParams.get("excludeFeatured");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    // Build where clause
    const where: any = {
      approved: true, // Only show approved posts
    };// Add category filter
    if (category && category !== "All") {
      // Use the formatCategoryForApi function to properly map categories
      const { formatCategoryForApi } = await import("@/lib/blog-utils");
      const categoryFormatted = formatCategoryForApi(category);
      if (categoryFormatted !== "All") {
        where.category = categoryFormatted as ProjectDomainEnum;
      }
    }    // Add featured filter
    if (featured === "true") {
      where.featured = true;
      // Note: approved: true is already set above, so featured posts will be approved
    }

    // Exclude featured posts if requested (for regular posts section)
    if (excludeFeatured === "true") {
      where.featured = false;
    }

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search }},
        { excerpt: { contains: search }},
        { author: { name: { contains: search} } }
      ];
    }    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            instagram: true,
            twitter: true,
            facebook: true,
            linkedin: true,
            medium: true,
            website: true,
            createdAt: true // <-- Add this line for recent posts too
          }
        }
      },
      orderBy: {
        publishedAt: "desc"
      },
      take: limit ? parseInt(limit) : 9, // Default to 9 for infinite scroll
      skip: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 9) : 0,
    });

    // Transform the data to match the expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      category: post.category,
      featured: post.featured,
      approved: post.approved,
      approvedById: post.approvedById,
      rejectedById: post.rejectedById,
      rejectedReason: post.rejectedReason,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts
    });

  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
