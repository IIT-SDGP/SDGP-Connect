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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  // Pages that should not have global horizontal margins
  const fullWidthPages = ['/contribute'];
  const isProjectPage = pathname.startsWith('/project');
  const shouldHaveMargins = !fullWidthPages.includes(pathname) && !isProjectPage;
  const isHome = pathname === "/";
  const horizontalMarginClass = !shouldHaveMargins
    ? ""
    : isHome
      ? "mx-3 md:mx-5 lg:mx-8"
      : "md:mx-24";

  /* Fixed desktop NavBar is a left rail (md+); symmetric inset — trimmed a bit for wider content */
  const projectNavClearance = isProjectPage ? "md:px-[5.5rem] lg:px-24" : "";

  /* Mobile dock is bottom-fixed; leave scroll room + home indicator (iOS) */
  const projectPageBottomPad = isProjectPage
    ? "pb-[max(5.5rem,env(safe-area-inset-bottom,0px)+4.5rem)] md:pb-0"
    : "";

  return (
    <ThemeProvider>
      <NavBar />
      <div
        className={cn(
          "min-w-0",
          horizontalMarginClass,
          projectNavClearance,
          projectPageBottomPad
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
    </ThemeProvider>
  );
}
