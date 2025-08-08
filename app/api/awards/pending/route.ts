import { prisma } from '@/prisma/prismaClient';
import { NextResponse } from 'next/server';

export async function GET() {
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
