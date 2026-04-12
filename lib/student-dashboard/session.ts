import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/types/prisma-types";

export type StudentSessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

type StudentSessionResult =
  | { user: StudentSessionUser; response?: never }
  | { user?: never; response: NextResponse };

export async function getStudentSessionUser(): Promise<StudentSessionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== Role.STUDENT) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (!session.user.id || !session.user.email) {
    return {
      response: NextResponse.json(
        { error: "Student session is missing required identity fields" },
        { status: 401 }
      ),
    };
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
}
