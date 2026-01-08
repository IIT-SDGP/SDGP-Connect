// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"
import { Hero7 } from "../modern-hero";
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
}

const Data = {
  heading: "More than just an academic module",
  description:
    "SDGP is a core academic module at IIT that redefines student learning by immersing them in real-world challenges. Through a blend of innovation, collaboration, and hands-on experience, it goes beyond traditional classroom education equipping students with practical skills, critical thinking, and a problem-solving mindset to create meaningful impact in society.",
  button: {
    text: "Discover more",
    url: "/about",
  },
  reviews: {
    count: 250,
    avatars: [
      {
        src: "/home/about-logo/raspberry.webp",
        alt: "Avatar 1",
      },
      {
        src: "/home/about-logo/amor.webp",
        alt: "Avatar 2",
      },
      {

        src: "/home/about-logo/lexi.webp",
        alt: "Avatar 3",
      },
      {
        src: "/home/about-logo/sealanka.webp",
        alt: "Avatar 4",
      },
      {
        src: "/assets/spark.webp",
        alt: "Avatar 4",
      },
      {
        src: "/home/about-logo/movemate.webp",
        alt: "Avatar 5",
      },
    ],
  },
};

function About() {
  const { t } = useLanguage();
  const homeCta = getNested(t, ["home", "cta"], {});
  const Data = {
    heading: homeCta.heading || "More than just an academic module",
    description:
      homeCta.description ||
      "SDGP is a core academic module at IIT that redefines student learning by immersing them in real-world challenges. Through a blend of innovation, collaboration, and hands-on experience, it goes beyond traditional classroom education equipping students with practical skills, critical thinking, and a problem-solving mindset to create meaningful impact in society.",
    button: {
      text: homeCta.button || "Discover more",
      url: "/about",
    },
    reviews: {
      count: 250,
      avatars: [
        {
          src: "/home/about-logo/raspberry.webp",
          alt: "Avatar 1",
        },
        {
          src: "/home/about-logo/amor.webp",
          alt: "Avatar 2",
        },
        {
          src: "/home/about-logo/lexi.webp",
          alt: "Avatar 3",
        },
        {
          src: "/home/about-logo/sealanka.webp",
          alt: "Avatar 4",
        },
        {
          src: "/assets/spark.webp",
          alt: "Avatar 4",
        },
        {
          src: "/home/about-logo/movemate.webp",
          alt: "Avatar 5",
        },
      ],
    },
  };
  return <Hero7 {...Data} />;
}

export { About };
