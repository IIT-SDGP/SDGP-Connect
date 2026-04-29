// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

const SUPPORT_EMAIL = "sdgp@iit.ac.lk";
const SUPPORT_PHONE_DISPLAY = "(+94) 77 778 1061";
const SUPPORT_PHONE_TEL = "+94777781061";

export default function Contact() {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Please enter your name.";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.interest || formData.interest.length < 5) {
      newErrors.interest = "Let us know your interest.";
    }

    if (!formData.message || formData.message.length < 20) {
      newErrors.message = "Please describe your inquiry (at least 20 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const openMail = () => {
    const subject = encodeURIComponent("SDGP Connect — inquiry");
    const body = encodeURIComponent(
      "Hello,\n\nI would like to get in touch regarding:\n\n"
    );
    window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-transparent dark:from-primary/[0.12]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 max-md:pb-28 sm:px-6 sm:py-9 lg:max-w-7xl lg:px-8 lg:py-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,400px)] lg:items-center lg:gap-10 xl:gap-14">
            <div className="space-y-5 lg:space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <LifeBuoy className="size-3.5 text-primary" aria-hidden />
              Contact
            </div>

            <div className="space-y-3">
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight">
                Talk to the SDGP team
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Questions about submissions, your account, or the platform? Send a message or reach us
                directly. We usually reply within a few working days.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              <a
                href={`tel:${SUPPORT_PHONE_TEL}`}
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3 shadow-sm backdrop-blur-sm transition-colors",
                  "hover:border-primary/30 hover:bg-card/80"
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Phone className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p>
                  <p className="text-sm font-semibold text-foreground">{SUPPORT_PHONE_DISPLAY}</p>
                </div>
              </a>

              <button
                type="button"
                onClick={openMail}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3 text-left shadow-sm backdrop-blur-sm transition-colors",
                  "hover:border-primary/30 hover:bg-card/80"
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Mail className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="truncate text-sm font-semibold text-foreground">{SUPPORT_EMAIL}</p>
                </div>
              </button>

              <div
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3 shadow-sm backdrop-blur-sm sm:col-span-2"
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
                  <MapPin className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Visit</p>
                  <p className="text-sm font-medium leading-snug text-foreground">
                    Informatics Institute of Technology — 57 Ramakrishna Road, Colombo 00600
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/faq" className="font-medium text-primary underline-offset-4 hover:underline">
                FAQ
              </Link>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <Link href="/submit" className="font-medium text-primary underline-offset-4 hover:underline">
                Submit hub
              </Link>
            </div>
          </div>

          <Card className="relative rounded-2xl border-border/80 bg-card/50 shadow-xl shadow-black/[0.04] backdrop-blur-md dark:bg-card/30 dark:shadow-black/20">
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:inset-x-8"
              aria-hidden
            />
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 px-4 pb-2 pt-4 sm:px-5">
              <MessageSquare className="size-4 shrink-0 text-primary" aria-hidden />
              <CardTitle className="text-base font-semibold leading-none">Send a message</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-0 sm:px-5">
              <form id={formId} onSubmit={handleSubmit} className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor={`${formId}-name`} className="text-xs font-medium">
                    Your name
                  </Label>
                  <Input
                    id={`${formId}-name`}
                    placeholder="Jane Perera"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    autoComplete="name"
                    className="h-9"
                  />
                  {errors.fullName ? (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${formId}-email`} className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    id={`${formId}-email`}
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    autoComplete="email"
                    className="h-9"
                  />
                  {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${formId}-company`} className="text-xs font-medium">
                    Company / group{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id={`${formId}-company`}
                    placeholder="Team or institution"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${formId}-interest`} className="text-xs font-medium">
                    Topic
                  </Label>
                  <Input
                    id={`${formId}-interest`}
                    placeholder="Submission help, bug report…"
                    value={formData.interest}
                    onChange={(e) => handleInputChange("interest", e.target.value)}
                    className="h-9"
                  />
                  {errors.interest ? (
                    <p className="text-xs text-destructive">{errors.interest}</p>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`${formId}-message`} className="text-xs font-medium">
                    Message
                  </Label>
                  <Textarea
                    id={`${formId}-message`}
                    placeholder="What should we know?"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="min-h-[4.5rem] resize-none text-sm"
                  />
                  {errors.message ? (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  ) : null}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2 border-t border-border/60 bg-muted/15 px-4 py-3 sm:px-5">
              <Button type="submit" form={formId} className="h-9 w-full rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
              {isSuccess ? (
                <div
                  className="flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-800 dark:text-emerald-200"
                  role="status"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  Thanks — we have received your note.
                </div>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
