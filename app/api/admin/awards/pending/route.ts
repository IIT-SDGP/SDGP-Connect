import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { ADMIN_READ_ROLES, requireRole } from '@/lib/auth/permissions';
export async function GET() {
  const auth = await requireRole(ADMIN_READ_ROLES);
  if (auth.error) return auth.error;

  const awards = await prisma.award.findMany({
    where: { approval_status: 'PENDING' },
    include: {
      project: true,
      competition: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(awards);
}
