import { NextResponse } from "next/server";

import { prisma } from "@/prisma/prismaClient";
import { blogSubmissionSchema } from "@/validations/blog";
import { getStudentSessionUser } from "@/lib/student-dashboard/session";

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
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "20", 10), 1);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      author: {
        is: {
          email: auth.user.email,
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
        include: {
          author: true,
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
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validatedData = blogSubmissionSchema.parse(body);

    if (validatedData.author.email !== auth.user.email) {
      return NextResponse.json(
        { error: "Blog author email must match the logged-in student" },
        { status: 403 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const author = await tx.blogAuthor.upsert({
        where: { email: auth.user.email },
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
          email: auth.user.email,
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
