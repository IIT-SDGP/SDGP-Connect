// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, ExternalLink, NotebookPen, Video } from "lucide-react";

import { lectureMeeting } from "@/data/lectureMeeting";
import { cn } from "@/lib/utils";

const CornerBrackets = () => (
  <>
    <span className="absolute top-[-3px] left-[-3px] w-[14px] h-[14px] border-t-2 border-l-2 border-zinc-700 rounded-tl-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
    <span className="absolute top-[-3px] right-[-3px] w-[14px] h-[14px] border-t-2 border-r-2 border-zinc-700 rounded-tr-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
    <span className="absolute bottom-[-3px] left-[-3px] w-[14px] h-[14px] border-b-2 border-l-2 border-zinc-700 rounded-bl-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
    <span className="absolute bottom-[-3px] right-[-3px] w-[14px] h-[14px] border-b-2 border-r-2 border-zinc-700 rounded-br-[3px] transition-colors duration-300 group-hover:border-zinc-500" />
  </>
);

const secondaryLinks = [
  {
    icon: NotebookPen,
    label: "Join and take notes",
    description: "Opens the meeting with Zoom notes enabled",
    href: lectureMeeting.notesUrl,
  },
];

export default function LectureSession() {
  const [copied, setCopied] = useState(false);

  const handleCopyMeetingId = () => {
    navigator.clipboard
      .writeText(lectureMeeting.meetingId.replace(/\s/g, ""))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => setCopied(false));
  };

  return (
    <section className="w-full py-12 md:py-14 lg:py-[5.5rem] text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Logos */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="relative w-[84px] h-[84px] group">
            <CornerBrackets />
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Image
                src="/assets/logo.webp"
                alt="Informatics Institute of Technology logo"
                width={676}
                height={887}
                className="w-11 h-auto"
                priority
              />
            </div>
          </div>

          <span className="h-14 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />

          <div className="relative w-[84px] h-[84px] group">
            <CornerBrackets />
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Image
                src="/iconw.svg"
                alt="SDGP logo"
                width={1500}
                height={720}
                className="w-16 h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center text-center mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
            <Video className="h-3.5 w-3.5" />
            Live Session
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-5">
            {lectureMeeting.title}
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg max-w-[560px] mx-auto mt-4 leading-relaxed">
            {lectureMeeting.subtitle}
          </p>
        </div>

        {/* Primary join action */}
        <div className="relative mt-10 p-6 sm:p-8 border border-zinc-800 bg-[#0c0c0e] rounded-xl overflow-hidden group">
          <CornerBrackets />
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />

          <a
            href={lectureMeeting.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#2a5298] px-6 py-3.5 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#2a5298]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a5298] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0e]"
          >
            <Video className="h-5 w-5" />
            Join Zoom Meeting
          </a>

          {/* Meeting ID */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <div className="text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Meeting ID
              </p>
              <p className="text-lg font-mono tracking-wider text-zinc-100 mt-1">
                {lectureMeeting.meetingId}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyMeetingId}
              aria-label="Copy meeting ID"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors duration-300 hover:border-zinc-500 hover:text-white",
                copied && "border-emerald-600/60 text-emerald-400 hover:text-emerald-400"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Secondary links */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            {secondaryLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left transition-colors duration-300 hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-zinc-100">
                      {link.label}
                    </span>
                    <span className="block text-xs text-zinc-500 mt-0.5">
                      {link.description}
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600" />
                </a>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Having trouble joining? Paste the meeting ID into the Zoom app, or reach
          out on the module chat.
        </p>
      </div>
    </section>
  );
}
