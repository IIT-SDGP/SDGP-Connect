// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { requireRole, STUDENT_ROLES } from '@/lib/auth/permissions';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(STUDENT_ROLES);
    if (auth.error) return auth.error;
    const userId = auth.session?.user.id;

    const body = await req.json();
    const { name, image, competition_id, project_id } = body;

    // Validate required fields (must be non-empty strings)
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof image !== 'string' || !image.trim() ||
      typeof competition_id !== 'string' || !competition_id.trim() ||
      typeof project_id !== 'string' || !project_id.trim()
    ) {
      return NextResponse.json(
        { error: 'All fields (name, image, competition_id, project_id) are required and must be non-empty strings.' },
        { status: 400 }
      );
    }

    const ownedProject = await prisma.projectMetadata.findFirst({
      where: {
        project_id,
        owner_userId: userId,
      },
      select: { project_id: true },
    });

    if (!ownedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create award in database
    const award = await prisma.award.create({
      data: {
        name,
        image,
        competition_id,
        project_id,
        approval_status: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        message: 'Award submitted successfully',
        award: {
          id: award.id,
          name: award.name,
          approval_status: award.approval_status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
