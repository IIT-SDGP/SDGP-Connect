// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Lazy load the code block component for better performance
const CodeBlockWithCopy = dynamic(() => import("@/components/contribute/code-block-with-copy"), {
  loading: () => <div className="bg-muted/50 rounded-md h-10 animate-pulse" />
});

export default function ContributingGuideSections({ cardVariants }: { cardVariants: any }) {
  const repoUrl = "https://github.com/IIT-SDGP/SDGP-Connect";
  const issuesUrl = "https://github.com/IIT-SDGP/SDGP-Connect/issues";

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8">How to Contribute</h2>
      <p className="text-center text-white/70 mb-12 max-w-3xl mx-auto">
        Contributions can be in many forms. Bug reports, feature suggestions, documentation improvements, design
        feedback, and code changes all help. If you plan to work on a GitHub issue, request assignment first so we can
        avoid duplicate work and agree on the approach.
      </p>

      <h3 className="text-xl font-semibold text-center mb-6">Why Contribute?</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-14">
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Help Students</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                Your improvements directly help SDGP teams submit, showcase, and get feedback on their work.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Learn on a Real Codebase</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                Work with a production Next.js app, Prisma, and real review feedback through pull requests.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Build Your Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                A merged PR is a concrete contribution you can show. Even small fixes add up.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <h3 className="text-xl font-semibold text-center mb-6">Ways to Contribute (Not Only Code)</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-14">
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Report Bugs</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                Clear steps to reproduce, screenshots, and logs help us fix issues faster.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Suggest Improvements</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                UX feedback, feature ideas, and edge cases are valuable. Open an issue and explain the problem.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Improve Docs and Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70">
                Fix unclear instructions, add examples, or improve page content. These changes help everyone.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <h3 className="text-xl font-semibold text-center mb-6">Working on a GitHub Issue (Code Changes)</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {/* Request assignment */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">1. Request Assignment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">
                Find an issue and comment asking to be assigned. In your comment, include your approach (how you plan to
                solve the problem) so maintainers can review quickly.
              </p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code={issuesUrl} className="mb-4" />
              </Suspense>
              <p className="text-sm text-white/50">
                Start work only after a maintainer assigns the issue to you.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fork & branch */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">2. Fork & Create a Branch</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">
                Fork the repository on GitHub, then clone <strong>your fork</strong> and create a branch for the issue.
              </p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="git clone https://github.com/<your-username>/SDGP-Connect.git" className="mb-4" />
              </Suspense>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="git checkout -b fix/issue-123-short-title" />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>

        {/* PR */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">3. Open a Pull Request</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">
                Push your branch to your fork and open a PR back to <strong>our main branch</strong>. We&apos;ll review it and
                merge once approved.
              </p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="git push -u origin fix/issue-123-short-title" className="mb-4" />
              </Suspense>
              <p className="text-sm text-white/50">
                Make sure your PR references the issue and explains what changed and why.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <h3 className="text-xl font-semibold text-center mt-14 mb-6">Local Development Setup (How to Code)</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {/* Clone */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">1. Clone Your Fork</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Clone your fork locally:</p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="git clone https://github.com/<your-username>/SDGP-Connect.git" className="mb-4" />
              </Suspense>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="cd SDGP-Connect" />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>

        {/* Install */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">2. Install Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Install packages (we use Yarn):</p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="yarn install" className="mb-4" />
              </Suspense>
              <p className="text-sm text-white/50">Tip: Keep your branch small and focused on the issue.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Run */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">3. Run Locally</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Start the dev server:</p>
              <Suspense fallback={<div className="bg-muted/50 rounded-md h-10 animate-pulse" />}>
                <CodeBlockWithCopy code="yarn dev" className="mb-4" />
              </Suspense>
              <p className="text-sm text-white/50">If you run into env/database setup, check the repo README.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <p className="text-center text-white/70 mt-12 max-w-2xl mx-auto">
        For full documentation and repository details, visit{" "}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {repoUrl}
        </a>
        .
      </p>
    </motion.section>
  )
}
