// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectSubmissionForm from "@/components/submit-form/SubmissionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const INSTRUCTIONS = [
  "All submissions are **reviewed** before approval.",
  "Reviews typically complete within **0–2 days**.",
  "**Failing to submit** may affect academic marks where required.",
  "Only **one team member** should submit on behalf of the group.",
  "After submit, **edits are not possible**—resubmit with corrections if needed.",
  "A **cover image** is required.",
  "Include at least **three gallery images**.",
  "**Contact number and email** are mandatory.",
  "You can **review** your entry after submission.",
  "Approved projects receive a confirmation **email**.",
  "If rejected, read feedback and **resubmit** correctly.",
  "**False information** may be treated as an offense.",
] as const;

const Page = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAgree = () => {
    setShowPopup(false);
    setTermsAccepted(true);
  };

  useEffect(() => {
    if (!termsAccepted) return;
    const timer = setTimeout(() => setShowHelpPopup(true), 10000);
    return () => clearTimeout(timer);
  }, [termsAccepted]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.12] via-transparent to-transparent dark:from-primary/[0.16]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Dialog open={showPopup}>
        <DialogContent
          className="gap-0 overflow-hidden border-border/80 p-0 sm:max-w-lg [&>button]:hidden"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="border-b border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
            <DialogHeader className="space-y-1 text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0 text-primary" aria-hidden />
                Before you start
              </div>
              <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                Submission instructions
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Please read and confirm. You will not be able to edit the project after submission.
              </DialogDescription>
            </DialogHeader>
          </div>
          <ScrollArea className="max-h-[min(60vh,22rem)] px-5 sm:px-6">
            <ul className="space-y-2.5 py-4 pr-3 text-sm leading-snug text-muted-foreground">
              {INSTRUCTIONS.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-primary/80"
                    aria-hidden
                  />
                  <span>
                    {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i} className="font-medium text-foreground">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <DialogFooter className="border-t border-border/60 bg-muted/20 px-5 py-4 sm:px-6">
            <Button className="w-full rounded-lg sm:w-auto" size="lg" onClick={handleAgree} type="button">
              I understand &amp; agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showHelpPopup ? (
        <div
          className="fixed z-40 max-md:bottom-28 md:bottom-24 right-4 max-w-[min(calc(100vw-2rem),280px)] animate-in slide-in-from-bottom-4 fade-in duration-500"
          style={{
            paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/95 shadow-lg backdrop-blur-md dark:bg-card/90">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <button
              type="button"
              onClick={() => setShowHelpPopup(false)}
              className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
            <div className="p-4 pr-10">
              <h3 className="text-sm font-semibold">Need help?</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Message us on WhatsApp if you are stuck on a step.
              </p>
              <Button asChild size="sm" className="mt-3 w-full rounded-lg gap-2" variant="secondary">
                <a
                  href="https://wa.me/94766867362"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-3.5" />
                  Chat now
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto max-w-5xl px-4 pb-28 pt-8 sm:px-6 sm:pb-24 sm:pt-10 md:max-w-6xl md:pt-12">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <Button variant="ghost" size="sm" className="group -ml-2 w-fit gap-2 text-muted-foreground" asChild>
            <Link href="/submit">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              All submit options
            </Link>
          </Button>
          <div className="space-y-2 sm:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:ml-auto">
              <Sparkles className="size-3 text-primary" aria-hidden />
              Project
            </div>
          </div>
        </div>

        <header className="mb-8 space-y-2 sm:mb-10 md:mb-12">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-tight">
            Submit your project
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Five guided steps—basics, story &amp; gallery, classification, contact, and team. Take your time;
            uploads save when you continue.
          </p>
        </header>

        <ProjectSubmissionForm />

        <div
          className={cn(
            "fixed z-40 flex flex-col items-end gap-2 transition-opacity",
            "right-4 max-md:bottom-28 md:bottom-8",
            showHelpPopup && "opacity-0 pointer-events-none"
          )}
          style={{
            paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div
            className={cn(
              "max-w-[200px] rounded-lg border border-border/80 bg-card/95 px-3 py-2 text-center text-xs text-muted-foreground shadow-md backdrop-blur-sm transition-all duration-200",
              showTooltip ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
            )}
          >
            Help on WhatsApp
          </div>
          <a
            href="https://wa.me/94766867362"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-14 items-center justify-center rounded-full border border-border bg-card text-primary shadow-lg ring-2 ring-primary/10 transition-all hover:ring-primary/25 hover:shadow-primary/15"
            aria-label="Open WhatsApp chat"
          >
            <MessageCircle className="size-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
