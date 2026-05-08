// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { Award, BarChart2, Rocket, TrendingUp, Users } from "lucide-react"
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

export default function ImpactStats() {
  const { t } = useLanguage();
  const impact = getNested(t, ['home', 'impact_stats'], {});

  const stats = [
    {
      title: impact.stat_1?.title || "1000+",
      description: impact.stat_1?.description || "Student Projects",
      icon: Users,
    },
    {
      title: impact.stat_2?.title || "100+",
      description: impact.stat_2?.description || "Industry Partners",
      icon: Award,
    },
    {
      title: impact.stat_3?.title || "15+",
      description: impact.stat_3?.description || "SDGs Addressed",
      icon: TrendingUp,
    },
    {
      title: impact.stat_4?.title || "75+",
      description: impact.stat_4?.description || "Startups Invested",
      icon: Rocket,
    },
  ];

  return (
    <section className="w-full py-12 md:py-14 lg:py-[5.5rem] text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-4">

          {/* Badge */}
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
              <BarChart2 className="h-3.5 w-3.5" />
              {impact.badge || "Impact Stats"}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto leading-tight">
            {impact.title || "Our Impact"}
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4 mb-8 leading-relaxed">
            {impact.description || "Driving real-world change through student innovation, industry collaboration, and sustainable development across Sri Lanka and beyond."}
          </p>

        </div>

        {/* Stats Grid */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center gap-4 rounded-xl border border-zinc-800 bg-[#0c0c0e] p-8 transition-colors duration-300 hover:border-zinc-700 overflow-hidden"
            >
              <CornerBrackets />

              {/* Top shimmer line */}
              <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />

              {/* Icon */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#2a5298]/15 border border-[#2a5298]/30">
                <stat.icon className="h-7 w-7 text-blue-300 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Number */}
              <h3 className="text-4xl font-bold tracking-tighter text-white">
                {stat.title}
              </h3>

              {/* Label */}
              <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 text-sm font-medium">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}