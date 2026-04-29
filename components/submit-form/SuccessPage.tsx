// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Home, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  projectId: string | null;
}

const SuccessPage = ({ projectId }: SuccessPageProps) => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-xl shadow-black/[0.04] backdrop-blur-sm dark:bg-card/25 dark:shadow-black/20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />
      <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-14 md:py-16">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.05 }}
          className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-sm shadow-primary/10"
        >
          <CheckCircle2 className="size-10" strokeWidth={2} />
        </motion.div>

        <motion.h1
          className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          You are on the list
        </motion.h1>

        <motion.p
          className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          Your project is pending review. We will email you when there is a decision. You can open the
          project page now—this tab will also redirect shortly.
        </motion.p>

        <motion.div
          className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {projectId ? (
            <Button
              onClick={() => router.push(`/project/${projectId}`)}
              className="w-full rounded-lg gap-2 sm:w-auto"
              size="lg"
            >
              View project
              <ExternalLink className="size-4" />
            </Button>
          ) : null}

          <Button variant="outline" asChild className="w-full rounded-lg gap-2 sm:w-auto" size="lg">
            <Link href="/submit/project">
              <Plus className="size-4" />
              Submit another
            </Link>
          </Button>

          <Button variant="ghost" asChild className="w-full rounded-lg gap-2 sm:w-auto" size="lg">
            <Link href="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
