// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";

const Globe = dynamic(
  () => import("@/components/ui/globe").then((m) => m.Globe),
  { ssr: false }
);

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
}

const GLOBE_STYLES = `
  @keyframes sdgp-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  @keyframes sdgp-pulse {
    0%, 100% { opacity: .4; transform: scale(1); }
    50%      { opacity: 1;  transform: scale(1.15); }
  }

  @keyframes sdgp-badgePing {
    0%, 100% { box-shadow: 0 0 0 0   rgba(59,130,246,.35); }
    50%      { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
  }

  @keyframes sdgp-shimmer {
    0%, 100% { opacity: .5; }
    50%      { opacity: 1;  }
  }

  @keyframes sdgp-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sdgp-globe-float {
    animation: sdgp-float 6s ease-in-out infinite;
  }

  .sdgp-stat-pill {
    background: rgba(6,32,86,.85);
    border: 1px solid rgba(59,130,246,.35);
    border-radius: 12px;
    padding: 10px 16px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 130px;
    animation: sdgp-fadeUp .7s ease both;
  }

  .sdgp-stat-pill--desktop {
    position: absolute;
  }

  .sdgp-stat-num {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .sdgp-stat-label {
    font-size: 11px;
    color: #71717a;
    letter-spacing: .05em;
  }

  .sdgp-bar {
    height: 2px;
    border-radius: 2px;
    background: rgba(59,130,246,.15);
    margin-top: 6px;
    overflow: hidden;
  }

  .sdgp-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #3b82f6, #6366f1);
    animation: sdgp-shimmer 2.5s ease-in-out infinite;
  }

  .sdgp-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(42,82,152,.5);
    background: rgba(42,82,152,.25);
    padding: 6px 16px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: #bfdbfe;
    animation: sdgp-badgePing 3s ease-in-out infinite;
  }

  .sdgp-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #60a5fa;
    animation: sdgp-pulse 2s ease-in-out infinite;
  }

  .sdgp-mobile-stats {
    display: none;
  }

  @media (max-width: 767px) {
    .sdgp-desktop-stats {
      display: none !important;
    }

    .sdgp-mobile-stats {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 0 16px 24px;
    }

    .sdgp-globe-wrapper {
      min-height: auto !important;
    }

    .sdgp-mobile-stats .sdgp-stat-pill {
      flex: 1 1 90px;
      min-width: 90px;
      max-width: 140px;
    }
  }
`;

export default function GlobeSection() {
  const { t } = useLanguage();

  const content = getNested(t, ["home", "global_reach"], {
    badge_label: "Our Vision",
    heading: "Tech for global good",
    description:
      "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software.",
    projects_value: "120+",
    projects_label: "Projects",
    students_value: "500+",
    students_label: "Students",
    sdgs_value: "12",
    sdgs_label: "SDGs targeted",
  });

  const stats = [
    { value: content.projects_value, label: content.projects_label, barWidth: "80%", delay: ".3s" },
    { value: content.students_value, label: content.students_label, barWidth: "90%", delay: ".5s" },
    { value: content.sdgs_value,     label: content.sdgs_label,     barWidth: "50%", delay: ".7s" },
  ];

  return (
    <section className="w-full text-white">
      <style>{GLOBE_STYLES}</style>

      <div className="w-full py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-4">

            <span className="sdgp-badge-pill">
              <span className="sdgp-badge-dot" />
              <Eye className="h-3.5 w-3.5" />
              {content.badge_label}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto">
              {content.heading}
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4">
              {content.description}
            </p>

          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full">
        <div
          className="sdgp-globe-wrapper max-w-7xl mx-auto w-full relative flex items-center justify-center px-4"
          style={{ minHeight: 500 }}
        >
          <div className="sdgp-desktop-stats">
            <div
              className="sdgp-stat-pill sdgp-stat-pill--desktop"
              style={{ left: "14%", top: "28%", animationDelay: ".3s" }}
            >
              <span className="sdgp-stat-num">{content.projects_value}</span>
              <span className="sdgp-stat-label">{content.projects_label}</span>
              <div className="sdgp-bar">
                <div className="sdgp-bar-fill" style={{ width: "80%" }} />
              </div>
            </div>

            <div
              className="sdgp-stat-pill sdgp-stat-pill--desktop"
              style={{ left: "14%", bottom: "28%", animationDelay: ".5s" }}
            >
              <span className="sdgp-stat-num">{content.students_value}</span>
              <span className="sdgp-stat-label">{content.students_label}</span>
              <div className="sdgp-bar">
                <div className="sdgp-bar-fill" style={{ width: "90%" }} />
              </div>
            </div>

            <div
              className="sdgp-stat-pill sdgp-stat-pill--desktop"
              style={{ right: "14%", top: "50%", transform: "translateY(-50%)", animationDelay: ".7s" }}
            >
              <span className="sdgp-stat-num">{content.sdgs_value}</span>
              <span className="sdgp-stat-label">{content.sdgs_label}</span>
              <div className="sdgp-bar">
                <div className="sdgp-bar-fill" style={{ width: "50%" }} />
              </div>
            </div>
          </div>

          <div
            className="relative flex items-center justify-center"
            style={{ width: "min(500px, 92vw)", height: "min(500px, 92vw)" }}
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.08) 45%, transparent 70%)",
                transform: "scale(1.15)",
              }}
            />
            <div
              className="sdgp-globe-float relative overflow-hidden"
              style={{ width: "80%", height: "80%" }}
            >
              <Globe className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="sdgp-mobile-stats">
          {stats.map(({ value, label, barWidth, delay }) => (
            <div key={label} className="sdgp-stat-pill" style={{ animationDelay: delay }}>
              <span className="sdgp-stat-num">{value}</span>
              <span className="sdgp-stat-label">{label}</span>
              <div className="sdgp-bar">
                <div className="sdgp-bar-fill" style={{ width: barWidth }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}