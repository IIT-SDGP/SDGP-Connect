// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { footerItem } from "@/data/footerItems";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail,Youtube } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}
const {
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  logoClassName,
  companyUrl,
  sections,
  socials,
} = footerItem;

const iconMap = {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
};
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="border-t flex justify-center w-full">
        <div className="container mx-auto  pt-8 md:pt-12 ">
          <div className="grid grid-cols-2 px-10 md:px-40 gap-8 md:grid-cols-5">
            <div className=" flex flex-col gap-4 col-span-2 md:col-span-1 justify-center items-center">
              {/* <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                className={logoClassName}
              />
            
            </a> */}
              <a href="https://ebadge.bestweb.lk/api/v1/clicked/sdgp.lk/BestWeb/2025/Rate_Us">
                <img
                  src="https://ebadge.bestweb.lk/eBadgeSystem/domainNames/sdgp.lk/BestWeb/2025/Rate_Us/image.png"
                  alt="logo"
                  width="150"
                  height="150"
                />
              </a>
            </div>

          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="mb-3 font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {section.title === "Legal" && (
                <div className="mt-4">
                  <h3 className="mb-3 font-semibold">Social Media</h3>
                  <div className="flex gap-3">
                    {footerItem.socials.map(({ name, href, icon }, index) => {
                      const IconComponent = iconMap[icon as keyof typeof iconMap];
                      return (
                        <a
                          key={index}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={name}
                          className="rounded-full bg-zinc-700 hover:bg-zinc-600 p-2.5 transition"
                        >
                          <IconComponent className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          </div>

          <div className="mt-2 border-t md:pb-4 pb-24 border-secondary-foreground/10 pt-2 text-center flex md:gap-4 gap-2 flex-col md:flex-row justify-center items-center">

            <p className="text-center text-sm text-gray-200 pb-4"> Copyright © {currentYear} - <strong><a href="https://sdgp.lk" className="text-center text-sm text-gray-200 pb-4">SDGP.LK</a></strong></p>

          </div>
        </div>
      </footer>
    </>
  );
}
