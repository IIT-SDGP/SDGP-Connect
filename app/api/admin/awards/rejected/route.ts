import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { ADMIN_READ_ROLES, requireRole } from '@/lib/auth/permissions';

export async function GET() {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const awards = await prisma.award.findMany({
    where: { approval_status: 'REJECTED' },
    include: {
      project: true,
      competition: true,
      rejected_by: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(awards);
}
