import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { authorCheckSchema } from '@/validations/blog';
import { requireRole, STUDENT_ROLES } from '@/lib/auth/permissions';

export async function POST(request: Request) {
  try {
    const auth = await requireRole(STUDENT_ROLES);
    if (auth.error) return auth.error;

    const body = await request.json();
    const { email } = authorCheckSchema.parse(body);
    const sessionEmail = auth.session?.user.email;

    if (!sessionEmail || email !== sessionEmail) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const author = await prisma.blogAuthor.findUnique({
      where: { email },
    });

    if (!author) {
      return NextResponse.json(
        { message: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error: any) {
    console.error('Error checking author:', error);
    
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
