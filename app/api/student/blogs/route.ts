// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { blogSubmissionSchema } from "@/validations/blog";
import { Role } from "@/types/prisma-types";

function applyBlogStatusFilter(where: Record<string, unknown>, status: string | null) {
  if (status === "pending") {
    where.approved = false;
    where.rejectedById = null;
  } else if (status === "approved") {
    where.approved = true;
  } else if (status === "rejected") {
    where.approved = false;
    where.rejectedById = { not: null };
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as any)?.role as Role | undefined;
  if (role !== Role.STUDENT) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const userEmail = session.user.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "20", 10), 1);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      author: {
        is: {
          email: userEmail,
        },
      },
    };

    applyBlogStatusFilter(where, status);

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          imageUrl: true,
          approved: true,
          rejectedById: true,
          rejectedReason: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: posts,
      metadata: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch student blogs", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as any)?.role as Role | undefined;
  if (role !== Role.STUDENT) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const userEmail = session.user.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = blogSubmissionSchema.parse(body);

    if (validatedData.author.email !== userEmail) {
      return NextResponse.json(
        { error: "Blog author email must match the logged-in student" },
        { status: 403 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const author = await tx.blogAuthor.upsert({
        where: { email: userEmail },
        update: {
          name: validatedData.author.name,
          avatarUrl: validatedData.author.avatarUrl || null,
          instagram: validatedData.author.instagram || null,
          twitter: validatedData.author.twitter || null,
          facebook: validatedData.author.facebook || null,
          linkedin: validatedData.author.linkedin || null,
          medium: validatedData.author.medium || null,
          website: validatedData.author.website || null,
        },
        create: {
          name: validatedData.author.name,
          email: userEmail,
          avatarUrl: validatedData.author.avatarUrl || null,
          instagram: validatedData.author.instagram || null,
          twitter: validatedData.author.twitter || null,
          facebook: validatedData.author.facebook || null,
          linkedin: validatedData.author.linkedin || null,
          medium: validatedData.author.medium || null,
          website: validatedData.author.website || null,
        },
      });

      return tx.blogPost.create({
        data: {
          title: validatedData.post.title,
          excerpt: validatedData.post.excerpt,
          content: validatedData.post.content,
          imageUrl: validatedData.post.imageUrl || null,
          category: validatedData.post.category,
          featured: false,
          approved: false,
          approvedById: null,
          rejectedById: null,
          rejectedReason: null,
          authorId: author.id,
        },
        include: {
          author: true,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create student blog", details: message },
      { status: 500 }
    );
  }
}
