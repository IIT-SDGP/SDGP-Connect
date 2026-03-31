// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Toaster } from "sonner";
import { CustomCursor } from "@/components/Cursor";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import useIsMobile from "@/hooks/useIsMobile";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ExpandableChatAI } from "@/components/ai/ExpandableChatAI";
import CookieBanner from "@/components/CookieBanner"
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const fullWidthPages = ['/contribute'];
  const shouldHaveMargins = !fullWidthPages.includes(pathname);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <NavBar />
        <div className={shouldHaveMargins ? "md:mx-24" : ""}>{children}</div>
        {!isMobile && <CustomCursor />}
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
        <Toaster />
        <ExpandableChatAI />
      </ThemeProvider>
    </SessionProvider>
  );
}