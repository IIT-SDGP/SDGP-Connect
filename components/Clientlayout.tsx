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
import CookieBanner from "@/components/CookieBanner"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChatBot from "@/components/ChatBot";
import { ChatBotProvider } from "@/hooks/ChatBotContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  // Pages that should not have global horizontal margins
  const fullWidthPages = ['/contribute'];
  const isProjectPage = pathname.startsWith('/project');
  const isCompetitionsPage =
    pathname === '/competitions' || pathname.startsWith('/competitions/');
  const isHome = pathname === "/";
  const shouldHaveMargins =
    !fullWidthPages.includes(pathname) &&
    !isProjectPage &&
    !isCompetitionsPage &&
    !isHome;
  const horizontalMarginClass = shouldHaveMargins
    ? "md:mx-6 lg:mx-12 xl:mx-24"
    : "";

  /* Left dock on desktop — no top inset. Mobile: bottom dock clearance. */
  const navBottomPad =
    "pb-[max(6rem,env(safe-area-inset-bottom,0px)+4rem)] md:pb-0";

  return (
    <ThemeProvider>
      <ChatBotProvider>
        <NavBar />
        <div
          className={cn(
            "min-w-0",
            horizontalMarginClass,
            navBottomPad
          )}
        >
          {children}
        </div>
        {!isMobile && <CustomCursor />}
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
        <Toaster />
        <ChatBot />
      </ChatBotProvider>
    </ThemeProvider>
  );
}
