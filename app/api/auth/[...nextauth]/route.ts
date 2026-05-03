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

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim().replace(/^['"]|['"]$/g, "");

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const asgardeoIssuer = getRequiredEnv("ASGARDEO_ISSUER_URL").replace(/\/+$/, "");

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    {
      id: "asgardeo",
      name: "Asgardeo",
      type: "oauth",
      clientId: getRequiredEnv("ASGARDEO_CLIENT_ID"),
      clientSecret: getRequiredEnv("ASGARDEO_CLIENT_SECRET"),
      issuer: asgardeoIssuer,
      wellKnown: `${asgardeoIssuer}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "login",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        const givenName = profile.given_name ?? "";
        const familyName = profile.family_name ?? "";
        const name = `${givenName} ${familyName}`.trim();
        const role = getRoleFromAsgardeoProfile(profile as Record<string, unknown>);

        return {
          id: profile.sub,
          name,
          email: profile.email,
          image: profile.picture ?? null,
          role: role ?? Role.STUDENT,
        };
      },
    },

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
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              password: true,
              role: true,
            },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
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
          select: { id: true, role: true },
        });
        const role = asgardeoRole ?? (dbUser?.role as Role | undefined) ?? (user as AppUser).role ?? Role.STUDENT;

        if (asgardeoRole && dbUser && dbUser.role !== asgardeoRole) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: asgardeoRole },
          });
        }

        token.id = dbUser?.id ?? user.id;
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
