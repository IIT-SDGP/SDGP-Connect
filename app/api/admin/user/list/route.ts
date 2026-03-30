import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Only admins can list users" },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
