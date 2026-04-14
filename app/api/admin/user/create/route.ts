import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

// Schema for validating user creation
const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'MODERATOR', 'DEVELOPER']),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
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
    const hashedPassword = await bcrypt.hash(password, 10);

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
        id: newUser.id,
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
