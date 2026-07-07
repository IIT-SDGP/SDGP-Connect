// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { sidebarItems } from "@/data/NavBarItems";

export default function HomeTopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-30 w-full">
      <div className="flex items-center justify-between gap-3 px-2 py-3 sm:px-8 md:px-12 lg:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/test.svg"
            alt="SDGP"
            width={180}
            height={86}
            className="h-auto w-[110px] object-contain sm:w-[130px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {sidebarItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex rounded-md bg-black/40 p-2 text-white lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="mx-2 mt-1 rounded-lg bg-black/80 p-2 backdrop-blur-md sm:mx-8 md:mx-12 lg:hidden">
          {sidebarItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
