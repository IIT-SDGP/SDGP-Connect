// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import { Award, Rocket, TrendingUp, Users } from "lucide-react"
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
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
    <section className="py-12 px-4 bg-dark text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{impact.title || "Our Impact"}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-[#0c0a09] border border-muted/60 ">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.title}</h3>
              <p className="text-gray-300">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



