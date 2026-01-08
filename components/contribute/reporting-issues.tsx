// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'

export default function ReportingIssues({ cardVariants }: { cardVariants: any }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Reporting Website Issues</h2>
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Opening an Issue</CardTitle>
              <CardDescription className="text-white/60">Help us make our software better!</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">
                All known issues of SDGP Connect are filed at:{" "}
                <a href="https://github.com/agzaiyenth/sdgp-connect/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  https://github.com/agzaiyenth/sdgp-connect/issues
                </a>
                . Please check this list before opening a new issue.
              </p>
              <Button asChild variant="outline" className="bg-white/[0.05] text-white border-white/[0.1] hover:bg-white/[0.1]">
                <a href="https://github.com/agzaiyenth/sdgp-connect/issues" target="_blank" rel="noopener noreferrer">
                  Submit Bug Report or Feature Request <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Reporting Security Issues</CardTitle>
              <CardDescription className="text-white/60">Your security is our priority.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">
                Please <strong>do not</strong> report security issues via GitHub issues. Instead, email your reports to:{" "}
                <a href="mailto:security@sdgp.lk" className="text-blue-400 hover:underline">
                  security@sdgp.lk
                </a>
                .
              </p>
              <Button asChild variant="outline" className="bg-white/[0.05] text-white border-white/[0.1] hover:bg-white/[0.1]">
                <a href="mailto:security@sdgp.lk">
                  Email Security Team <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
