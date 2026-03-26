import "../globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ClientProviders } from "@/components/Providers/ClientProvider";
import { StudentDashboardLayout } from "@/components/layout/student-dashboard-layout";
import { Role } from "@/types/prisma-types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Modern student dashboard built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userRole = (session.user as any)?.role as Role | undefined;
  if (userRole !== Role.STUDENT) redirect("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders session={session}>
          <StudentDashboardLayout>{children}</StudentDashboardLayout>
        </ClientProviders>
      </body>
    </html>
  );
}

