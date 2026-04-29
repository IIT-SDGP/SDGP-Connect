"use client";

import { Toaster } from "sonner";
import { CustomCursor } from "@/components/Cursor";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import useIsMobile from "@/hooks/useIsMobile";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from "@/components/CookieBanner";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const fullWidthPages = ['/', '/contribute'];
  const shouldHaveMargins = !fullWidthPages.includes(pathname);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {!isHomePage && <NavBar />}
        <div className={shouldHaveMargins ? "md:mx-24" : ""}>{children}</div>
        {!isMobile && <CustomCursor />}
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}