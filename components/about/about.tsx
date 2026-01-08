// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import { Eye, Target, HeartHandshake } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
}

export function AboutSection() {
  const { t } = useLanguage();
  const about = getNested(t, ['home', 'about'], {});
  const vision = about.vision_card || {};
  const values = about.values_card || {};
  const mission = about.mission_card || {};
  return (
    <section className="w-full py-12 md:py-14 lg:py-22 text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo Section */}
          <div className="relative w-24 h-24 mb-2">
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 rounded-2xl">
              <div className="w-12 h-12 text-white flex items-center justify-center">
                <Image
                  src="/assets/logo.webp"
                  alt="Logo"
                  width={120}
                  height={80}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto">
            {about.heading || "Crafting code for a sustainable tomorrow"}
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4 mb-8">
            {about.description || "Build impactful tech solutions through teamwork, innovation, and purpose driven by SDGP and the UN SDGs."}
          </p>

          {/* Cards Grid */}
          <div className="w-full max-w-6xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {/* Vision Card */}
              <div className="flex flex-col p-6 border border-zinc-800 rounded-lg w-full max-w-sm h-full">
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <Eye size={18} className="text-white" />
                  <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">{vision.title || "Our Vision"}</span>
                </div>
                <p className="text-xl font-bold mb-3 text-center">{vision.sub_title || "Tech for global good"}</p>
                <p className="text-zinc-400 text-center flex-grow leading-relaxed">
                  {vision.description || "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software."}
                </p>
              </div>

              {/* Core Values Card */}
              <div className="flex flex-col p-6 border border-zinc-800 rounded-lg w-full max-w-sm h-full">
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <HeartHandshake size={18} className="text-white" />
                  <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">{values.title || "Our Core Values"}</span>
                </div>
                <p className="text-xl font-bold mb-3 text-center">{values.sub_title || "Driven by purpose"}</p>
                <p className="text-zinc-400 text-center flex-grow leading-relaxed">
                  {values.description || "We believe in innovation, collaboration, and meaningful impact. Our community thrives on solving real-world problems, learning continuously, and developing technology that serves humanity and the planet."}
                </p>
              </div>
              {/* Mission Card */}
              <div className="flex flex-col p-6 border border-zinc-800 rounded-lg w-full max-w-sm h-full md:col-span-2 lg:col-span-1 md:max-w-none lg:max-w-sm md:mx-auto lg:mx-0">
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <Target size={18} className="text-white" />
                  <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">{mission.title || "Our Mission"}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{mission.sub_title || "Empowering Innovators"}</h3>
                <p className="text-zinc-400 text-center flex-grow leading-relaxed">
                  {mission.description || "To empower the next generation of socially-conscious developers by offering hands-on experience in building impactful full-stack applications that address real-world challenges aligned with the UN SDGs."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}