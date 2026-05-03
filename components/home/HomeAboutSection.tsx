// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";

type Dict = Record<string, unknown>;

function getNested(obj: unknown, path: string[], fallback: Dict): Dict {
  const source = obj as Dict | undefined;
  const value = path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dict)) {
      return (acc as Dict)[key];
    }
    return undefined;
  }, source);

  if (value && typeof value === "object") {
    return value as Dict;
  }

  return fallback;
}

const partnerLogos = [
  { src: "/home/about-logo/raspberry.webp", alt: "Raspberry" },
  { src: "/home/about-logo/amor.webp", alt: "Amor" },
  { src: "/home/about-logo/lexi.webp", alt: "Lexi" },
  { src: "/home/about-logo/sealanka.webp", alt: "Sea Lanka" },
  { src: "/home/about-logo/movemate.webp", alt: "MoveMate" },
];

export default function HomeAboutSection() {
  const { t } = useLanguage();
  const homeCta = getNested(t, ["home", "cta"], {});

  const heading =
    (homeCta.heading as string) ||
    "More than just an academic module";

  const description =
    (homeCta.description as string) ||
    "SDGP is a core academic module at IIT that redefines student learning by immersing them in real-world challenges with innovation, collaboration, and practical execution.";

  const buttonText = (homeCta.button as string) || "Discover more";

  return (
    <section className="relative overflow-hidden px-2 sm:px-8 md:px-12 lg:px-16">
      <div className="relative mx-auto max-w-[1280px] rounded-3xl border border-white/10 bg-black/35 p-6 text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              SDGP Experience
            </span>

            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {heading}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {buttonText}
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {partnerLogos.map((item) => (
                <div
                  key={item.src}
                  className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white/10"
                >
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="36px" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-black/65 to-transparent" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/15">
                  <Image
                    src="/assets/inno.webp"
                    alt="SDGP project showcase"
                    width={900}
                    height={560}
                    className="h-[210px] w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/15">
                  <Image
                    src="/assets/dialog-ino.webp"
                    alt="SDGP partner showcase"
                    width={900}
                    height={560}
                    className="h-[170px] w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              </div>

              <div className="space-y-4 sm:pt-8">
                <div className="relative overflow-hidden rounded-2xl border border-white/15">
                  <Image
                    src="/assets/inno.webp"
                    alt="Student innovation"
                    width={500}
                    height={420}
                    className="h-[150px] w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/15">
                  <Image
                    src="/assets/dialog-ino.webp"
                    alt="Industry collaboration"
                    width={500}
                    height={500}
                    className="h-[220px] w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
