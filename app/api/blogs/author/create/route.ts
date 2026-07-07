// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { blogAuthorSchema } from '@/validations/blog';
import { requireRole, STUDENT_ROLES } from '@/lib/auth/permissions';

export async function POST(request: Request) {
  try {
    const auth = await requireRole(STUDENT_ROLES);
    if (auth.error) return auth.error;

    const body = await request.json();
    const validatedData = blogAuthorSchema.parse(body);
    const sessionEmail = auth.session?.user.email;

    if (!sessionEmail || validatedData.email !== sessionEmail) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if author with this email already exists
    const existingAuthor = await prisma.blogAuthor.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAuthor) {
      return NextResponse.json(
        { message: 'Author with this email already exists' },
        { status: 409 }
      );
    }

    // Create new author
    const author = await prisma.blogAuthor.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        avatarUrl: validatedData.avatarUrl || null,
        instagram: validatedData.instagram || null,
        twitter: validatedData.twitter || null,
        facebook: validatedData.facebook || null,
        linkedin: validatedData.linkedin || null,
        medium: validatedData.medium || null,
        website: validatedData.website || null,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error: any) {
    console.error('Error creating author:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
