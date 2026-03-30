// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { AboutSection } from '@/components/about/about';
import { About } from "@/components/home/about-section";
import { Brands } from "@/components/home/brands";
import Domains from "@/components/home/domains";
import Hero from "@/components/home/hero";
import ImpactStats from "@/components/home/impact-stats";
import { LanguageProvider } from "@/hooks/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="flex flex-col gap-12 pb-12">
        <Hero />
        <About />
        <AboutSection/>
        <Domains />
        <ImpactStats />
        <Brands/>
      </div>
      <LanguageToggle />
    </LanguageProvider>
  )
}