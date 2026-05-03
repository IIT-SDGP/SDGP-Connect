import { prisma } from '@/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_READ_ROLES, requireRole } from '@/lib/auth/permissions';

export async function GET(req: NextRequest) {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 10;

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const where: any = {
    approval_status: status,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { project: { title: { contains: search, mode: 'insensitive' } } },
        { competition: { name: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  };

  try {
    const [awards, total] = await Promise.all([
      prisma.award.findMany({
        where,
        include: {
          competition: true,
          project: true,
          accepted_by: true,
          rejected_by: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.award.count({ where }),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return NextResponse.json({ awards, currentPage: page, totalPages });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
