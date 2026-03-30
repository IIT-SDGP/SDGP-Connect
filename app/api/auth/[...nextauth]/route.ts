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
      clientId: process.env.ASGARDEO_CLIENT_ID!,
      clientSecret: process.env.ASGARDEO_CLIENT_SECRET!,
      issuer: process.env.ASGARDEO_ISSUER_URL!,
      wellKnown: `${process.env.ASGARDEO_ISSUER_URL}/.well-known/openid-configuration`,
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

        return {
          id: profile.sub,
          name,
          email: profile.email,
          image: profile.picture ?? null,
          role: Role.STUDENT,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AppUser).role;
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