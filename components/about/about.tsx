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

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-[-1px] left-[-1px] w-[14px] h-[14px] border-t-2 border-l-2 border-zinc-600 rounded-tl-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
      <span className="absolute top-[-1px] right-[-1px] w-[14px] h-[14px] border-t-2 border-r-2 border-zinc-600 rounded-tr-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
      <span className="absolute bottom-[-1px] left-[-1px] w-[14px] h-[14px] border-b-2 border-l-2 border-zinc-600 rounded-bl-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
      <span className="absolute bottom-[-1px] right-[-1px] w-[14px] h-[14px] border-b-2 border-r-2 border-zinc-600 rounded-br-[3px] transition-colors duration-300 group-hover:border-zinc-400" />
    </>
  );
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
          <div className="relative w-[72px] h-[72px] mb-2 group">
            <span className="absolute top-[-3px] left-[-3px] w-[14px] h-[14px] border-t-2 border-l-2 border-zinc-700 rounded-tl-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
            <span className="absolute top-[-3px] right-[-3px] w-[14px] h-[14px] border-t-2 border-r-2 border-zinc-700 rounded-tr-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
            <span className="absolute bottom-[-3px] left-[-3px] w-[14px] h-[14px] border-b-2 border-l-2 border-zinc-700 rounded-bl-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
            <span className="absolute bottom-[-3px] right-[-3px] w-[14px] h-[14px] border-b-2 border-r-2 border-zinc-700 rounded-br-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="w-12 h-12 text-white flex items-center justify-center">
                <Image src="/assets/logo.webp" alt="Logo" width={120} height={80} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto leading-tight">
            {about.heading || "Crafting code for a sustainable tomorrow"}
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4 mb-8 leading-relaxed">
            {about.description || "Build impactful tech solutions through teamwork, innovation, and purpose driven by SDGP and the UN SDGs."}
          </p>

          {/* Cards Grid */}
          <div className="w-full max-w-6xl mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">

              {/* Vision Card */}
              <div className="group relative flex flex-col p-6 border border-zinc-800 bg-[#0c0c0e] rounded-xl w-full max-w-sm h-full hover:border-zinc-700 transition-colors duration-300 overflow-hidden">
                <CornerBrackets />
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
                    <Eye className="h-3.5 w-3.5" />
                    {vision.title || "Our Vision"}
                  </span>
                </div>
                <div className="w-8 h-px bg-zinc-800 mx-auto mb-3" />
                <p className="text-base font-semibold mb-3 text-center text-zinc-200">
                  {vision.sub_title || "Tech for global good"}
                </p>
                <p className="text-zinc-500 text-sm text-center flex-grow leading-relaxed">
                  {vision.description || "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software."}
                </p>
              </div>

              {/* Core Values Card */}
              <div className="group relative flex flex-col p-6 border border-zinc-800 bg-[#0c0c0e] rounded-xl w-full max-w-sm h-full hover:border-zinc-700 transition-colors duration-300 overflow-hidden">
                <CornerBrackets />
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    {values.title || "Our Core Values"}
                  </span>
                </div>
                <div className="w-8 h-px bg-zinc-800 mx-auto mb-3" />
                <p className="text-base font-semibold mb-3 text-center text-zinc-200">
                  {values.sub_title || "Driven by purpose"}
                </p>
                <p className="text-zinc-500 text-sm text-center flex-grow leading-relaxed">
                  {values.description || "We believe in innovation, collaboration, and meaningful impact. Our community thrives on solving real-world problems, learning continuously, and developing technology that serves humanity and the planet."}
                </p>
              </div>

              {/* Mission Card */}
              <div className="group relative flex flex-col p-6 border border-zinc-800 bg-[#0c0c0e] rounded-xl w-full max-w-sm h-full md:col-span-2 lg:col-span-1 md:max-w-none lg:max-w-sm md:mx-auto lg:mx-0 hover:border-zinc-700 transition-colors duration-300 overflow-hidden">
                <CornerBrackets />
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />
                <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
                    <Target className="h-3.5 w-3.5" />
                    {mission.title || "Our Mission"}
                  </span>
                </div>
                <div className="w-8 h-px bg-zinc-800 mx-auto mb-3" />
                <h3 className="text-base font-semibold mb-3 text-center text-zinc-200">
                  {mission.sub_title || "Empowering Innovators"}
                </h3>
                <p className="text-zinc-500 text-sm text-center flex-grow leading-relaxed">
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