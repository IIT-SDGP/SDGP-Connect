// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prismaClient";
import { Role } from "@/types/prisma-types";

interface AppUser extends NextAuthUser {
  role: Role;
}

const normalizeRole = (value: unknown): Role | null => {
  if (typeof value !== "string") return null;

  const role = value.trim().toUpperCase();
  if (role.includes("ADMIN")) return Role.ADMIN;
  if (role.includes("MODERATOR")) return Role.MODERATOR;
  if (role.includes("DEVELOPER")) return Role.DEVELOPER;
  if (role.includes("STUDENT")) return Role.STUDENT;

  return null;
};

const valuesFromClaim = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/[,\s]+/).filter(Boolean);
  return [];
};

const getRoleFromAsgardeoProfile = (profile: Record<string, unknown>): Role | null => {
  const roleClaims = [
    profile.role,
    profile.roles,
    profile.groups,
    profile["http://wso2.org/claims/role"],
    profile["http://wso2.org/claims/roles"],
    profile["http://wso2.org/claims/groups"],
  ];

  for (const claim of roleClaims.flatMap(valuesFromClaim)) {
    const role = normalizeRole(claim);
    if (role) return role;
  }

  return null;
};

const getEnv = (key: string) =>
  process.env[key]?.trim().replace(/^['"]|['"]$/g, "") ?? "";

const asgardeoIssuer = getEnv("ASGARDEO_ISSUER_URL").replace(/\/+$/, "");
const asgardeoClientId = getEnv("ASGARDEO_CLIENT_ID");
const asgardeoClientSecret = getEnv("ASGARDEO_CLIENT_SECRET");
const asgardeoEnabled =
  Boolean(asgardeoIssuer) && Boolean(asgardeoClientId) && Boolean(asgardeoClientSecret);

const asgardeoProvider = {
  id: "asgardeo",
  name: "Asgardeo",
  type: "oauth" as const,
  clientId: asgardeoClientId,
  clientSecret: asgardeoClientSecret,
  issuer: asgardeoIssuer,
  wellKnown: `${asgardeoIssuer}/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: "openid email profile",
      prompt: "login",
    },
  },
  idToken: true,
  checks: ["pkce", "state"] as ("pkce" | "state")[],
  allowDangerousEmailAccountLinking: true,
  profile(profile: Record<string, unknown>) {
    const givenName = profile.given_name ?? "";
    const familyName = profile.family_name ?? "";
    const name = `${givenName} ${familyName}`.trim();
    const role = getRoleFromAsgardeoProfile(profile);

    return {
      id: profile.sub as string,
      name,
      email: profile.email as string,
      image: (profile.picture as string | null) ?? null,
      role: role ?? Role.STUDENT,
    };
  },
};

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    ...(asgardeoEnabled ? [asgardeoProvider] : []),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          const userId =
            (user as { id?: string; user_id?: string }).id ??
            (user as { user_id?: string }).user_id;

          if (!userId) return null;

          return {
            id: userId,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as unknown as Role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        const email = token.email ?? user.email;
        if (!email) return token;

        const asgardeoRole =
          account.provider === "asgardeo" && profile
            ? getRoleFromAsgardeoProfile(profile as Record<string, unknown>)
            : null;
        const dbUser = await prisma.user.findUnique({
          where: { email },
        });
        const dbUserId =
          dbUser &&
          ((dbUser as { id?: string; user_id?: string }).id ??
            (dbUser as { user_id?: string }).user_id);
        const role = asgardeoRole ?? (dbUser?.role as Role | undefined) ?? (user as AppUser).role ?? Role.STUDENT;

        if (asgardeoRole && dbUser && dbUserId && dbUser.role !== asgardeoRole) {
          await prisma.user.update({
            where: { email },
            data: { role: asgardeoRole },
          });
        }

        token.id = dbUserId ?? user.id;
        token.role = role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
