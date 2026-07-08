// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { AboutSection } from '@/components/about/about';
import HomeAboutSection from "@/components/home/HomeAboutSection";
import GlobeSection from "@/components/home/globe-section";
import { Brands } from "@/components/home/brands";
import Domains from "@/components/home/domains";
import ImpactStats from "@/components/home/impact-stats";
import { LanguageProvider } from "@/hooks/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import HomeHeroSection from "@/components/home/HomeHeroSection";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="flex min-w-0 max-w-full flex-col overflow-x-clip pb-12">
        <HomeHeroSection />
        <div className="mx-3 md:mx-5 lg:mx-8 flex flex-col gap-12">
          <HomeAboutSection />
          <GlobeSection />
          <AboutSection/>
          <Domains />
          <ImpactStats />
          <Brands/>
        </div>
      </div>
      <LanguageToggle />
    </LanguageProvider>
  )
}