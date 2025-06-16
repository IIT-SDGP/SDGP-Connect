import { NextResponse } from 'next/server';
import {prisma} from '@/prisma/prismaClient';

export async function GET() {
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
