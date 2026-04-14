import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prismaClient";
import { blogSubmissionSchema } from "@/validations/blog";
import { Role } from "@/types/prisma-types";

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
    const { id } = await params;
    const post = await getOwnedBlog(id, userEmail);

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
    const { id } = await params;
    const existing = await getOwnedBlog(id, userEmail);

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

    if (validatedData.author.email !== userEmail) {
      return NextResponse.json(
        { error: "Blog author email must match the logged-in student" },
        { status: 403 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
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
    const { id } = await params;
    const existing = await getOwnedBlog(id, userEmail);

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
