import { prisma } from '@/prisma/prismaClient';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as z from 'zod';

// Schema for validating user creation
const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'MODERATOR', 'DEVELOPER']),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const currentUser = await prisma.user.findFirst({
      where: {
        // Assuming user_id is stored in session.user.id
        user_id: (session.user as any).id,
      },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Only admins can create users" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = userCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }    const { name, password, role } = validationResult.data;

    // Check if user with the same name already exists
    const existingUser = await prisma.user.findFirst({ where: { name } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this name already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage =
      (error as any)?.message && (error as any)?.message.includes("Unique constraint failed")
        ? "User with this name already exists"
        : "Failed to create user";

    const statusCode = errorMessage === "User with this name already exists" ? 400 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
