// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from "react";
import Markdown from "markdown-to-jsx";
import { Card } from "../ui/card";
import { CalendarClock, Lightbulb, Target, Users, Users2 } from "lucide-react";

interface ProjectOverviewProps {
  problemStatement?: string;
  solution?: string;
  keyFeatures?: string;
  teamNumber: string;
  projectYear: string;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  problemStatement,
  solution,
  keyFeatures,
  teamNumber,
  projectYear
}) => {
  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border p-4 shadow-sm sm:p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.12),transparent_32%)]" />
        <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Project Overview</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Vision and Implementation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A concise narrative of the challenge, solution, and feature set.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[220px] lg:max-w-[280px]">
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                SDGP Year
              </span>
              <span className="font-semibold tabular-nums text-foreground">{projectYear}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Users2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                Team Number
              </span>
              <span className="max-w-[60%] text-right font-semibold text-foreground">{teamNumber}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="border bg-card/90 p-4 sm:p-6">
          <h3 className="mb-3 inline-flex items-center gap-3 text-xl font-semibold">
            <span className="inline-flex rounded-lg bg-rose-500/15 p-2 ring-1 ring-rose-500/25">
              <Target className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden />
            </span>
            Problem Statement
          </h3>
          <p className="text-muted-foreground leading-7">
            {problemStatement || "Problem statement has not been provided yet."}
          </p>
        </Card>

        <Card className="border bg-card/90 p-4 sm:p-6">
          <h3 className="mb-3 inline-flex items-center gap-3 text-xl font-semibold">
            <span className="inline-flex rounded-lg bg-amber-500/15 p-2 ring-1 ring-amber-500/30">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
            </span>
            Solution
          </h3>
          <p className="text-muted-foreground leading-7">
            {solution || "Solution details have not been provided yet."}
          </p>
        </Card>
      </div>

      <Card className="border bg-card/90 p-4 sm:p-6">
        <h3 className="mb-3 inline-flex items-center gap-3 text-xl font-semibold">
          <span className="inline-flex rounded-lg bg-violet-500/15 p-2 ring-1 ring-violet-500/25">
            <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
          </span>
          Key Features
        </h3>
        <div className="prose prose-sm max-w-none overflow-x-auto break-words text-muted-foreground dark:prose-invert">
          {keyFeatures ? (
            <Markdown
              options={{
                overrides: {
                  h1: { props: { className: "text-2xl font-bold mb-4 break-words text-foreground" } },
                  h2: { props: { className: "text-xl font-bold mb-3 break-words text-foreground" } },
                  h3: { props: { className: "text-lg font-bold mb-2 break-words text-foreground" } },
                  p: { props: { className: "mb-4 break-words leading-7" } },
                  ul: { props: { className: "list-disc pl-6 mb-4 max-w-full break-words space-y-1" } },
                  ol: { props: { className: "list-decimal pl-6 mb-4 max-w-full break-words space-y-1" } },
                  li: { props: { className: "mb-1 break-words" } },
                  pre: {
                    props: {
                      className:
                        "whitespace-pre-wrap break-words max-w-full rounded bg-muted p-3 mb-4 overflow-x-auto",
                    },
                  },
                  code: { props: { className: "whitespace-normal break-words bg-muted rounded px-1 py-0.5" } },
                },
              }}
            >
              {keyFeatures}
            </Markdown>
          ) : (
            <p>Feature highlights have not been added yet.</p>
          )}
        </div>
      </Card>
    </section>
  );
};
