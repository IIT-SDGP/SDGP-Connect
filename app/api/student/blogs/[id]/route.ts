import { NextResponse } from "next/server";

import { prisma } from "@/prisma/prismaClient";
import { blogSubmissionSchema } from "@/validations/blog";
import { getStudentSessionUser } from "@/lib/student-dashboard/session";

async function getOwnedBlog(blogId: string, email: string) {
  return prisma.blogPost.findFirst({
    where: {
      id: blogId,
      author: {
        is: {
          email,
        },
      },
    },
    include: {
      author: true,
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const post = await getOwnedBlog(id, auth.user.email);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch student blog", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const existing = await getOwnedBlog(id, auth.user.email);

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (existing.approved) {
      return NextResponse.json(
        { error: "Approved blog posts cannot be edited from the student dashboard" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const validatedData = blogSubmissionSchema.parse(body);

    if (validatedData.author.email !== auth.user.email) {
      return NextResponse.json(
        { error: "Blog author email must match the logged-in student" },
        { status: 403 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
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

      return tx.blogPost.update({
        where: { id },
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

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update student blog", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getStudentSessionUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const existing = await getOwnedBlog(id, auth.user.email);

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (existing.approved) {
      return NextResponse.json(
        { error: "Approved blog posts cannot be deleted from the student dashboard" },
        { status: 409 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete student blog", details: message },
      { status: 500 }
    );
  }
}
