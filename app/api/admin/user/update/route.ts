import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { getServerSession } from 'next-auth';
import * as z from 'zod';
import { hash } from 'bcrypt';

// Schema for validating user updates
const userUpdateSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['ADMIN', 'MODERATOR', 'DEVELOPER']).optional(),
});

export async function PATCH(req: Request) {
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
        { error: "Only admins can update users" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = userUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }    const { user_id, name, password, role } = validationResult.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    // Hash password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        user_id,
      },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
