import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/types/prisma-types";

export const ADMIN_READ_ROLES = [Role.ADMIN, Role.MODERATOR, Role.DEVELOPER] as const;
export const ADMIN_WRITE_ROLES = [Role.ADMIN, Role.MODERATOR] as const;
export const STUDENT_ROLES = [Role.STUDENT] as const;

export async function requireRole(allowedRoles: readonly Role[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }

  const role = session.user.role as Role | undefined;
  if (!role || !allowedRoles.includes(role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
}
