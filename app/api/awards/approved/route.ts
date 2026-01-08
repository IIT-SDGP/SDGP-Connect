// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextResponse } from 'next/server';
import {prisma} from '@/prisma/prismaClient';

const awards = await prisma.award.findMany({
  where: { approval_status: 'APPROVED' },
  include: {
    project: true,
    competition: true,
    accepted_by: true,  
  },
  orderBy: { createdAt: 'desc' }, 
});


