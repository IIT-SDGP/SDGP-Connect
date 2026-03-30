// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function WhatIsSdgp({ cardVariants }: { cardVariants: any }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8">What is SDGP Connect?</h2>
      <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
          <CardContent className="p-6 md:p-8">
            <p className="text-lg text-white/70 leading-relaxed">
              <a href="https://sdgp.lk" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">sdgp.lk</a> is a platform built for the{" "}
              <strong>Informatics Institute of Technology (IIT)</strong> as part of the SDGP (Software Development Group Project) module. Its core mission is to{" "}
              <strong>showcase student-led tech projects</strong> and{" "}
              <strong>connect them with real-world investors, mentors, and industry partners</strong>.
            </p>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              SDGP Connect helps students go beyond academic recognition and{" "}
              <strong>attract funding, incubation, or partnerships</strong> that can help bring their projects to life.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  )
}
