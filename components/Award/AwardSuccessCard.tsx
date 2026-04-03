// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AwardSuccessCardProps {
  redirectTo?: string;
  redirectDelayMs?: number;
}

export function AwardSuccessCard({
  redirectTo = "/competitions",
  redirectDelayMs = 5000,
}: AwardSuccessCardProps) {
  const router = useRouter();
  const redirectDelaySeconds = Math.max(1, Math.ceil(redirectDelayMs / 1000));

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, redirectDelayMs);

    return () => clearTimeout(timer);
  }, [router, redirectTo, redirectDelayMs]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 dark:bg-green-900/30 mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>

        <motion.h1
          className="text-2xl font-semibold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Award Submitted Successfully!
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Your award submission has been submitted and is now under review. You
          will be notified once it's approved.
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Redirecting in {redirectDelaySeconds} second
          {redirectDelaySeconds === 1 ? "" : "s"}...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={() => router.push(redirectTo)} className="mt-4">
            Go Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
