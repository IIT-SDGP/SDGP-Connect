import { prisma } from '@/prisma/prismaClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const awards = await prisma.award.findMany({
    where: { approval_status: 'APPROVED' },
    include: {
      project: true,
      competition: true,
      accepted_by: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(awards);
}
