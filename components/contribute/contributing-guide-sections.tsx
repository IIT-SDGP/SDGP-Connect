/* Copyright (c) 2025, the contributors of the SDGP Connect project. All Rights Reserved.

This software is the joint property of the contributors to the SDGP Connect project.
Unauthorized distribution, commercial use, or reproduction of any part of this material
in any form is strictly prohibited without the explicit written consent of all contributors.
You may not alter or remove any copyright or attribution notice from this content. */

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CodeBlockWithCopy from "@/components/contribute/code-block-with-copy"

export default function ContributingGuideSections({ cardVariants }: { cardVariants: any }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8">How to Make Your Mark</h2>
      <p className="text-center text-white/70 mb-12 max-w-3xl mx-auto">
        Ready to impact thousands of students and developers? Your code doesn't just sit in a repository—it powers the platform that showcases amazing projects and connects the next generation of innovators. Here's how you can contribute and see your changes live for everyone to experience.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {/* Cloning */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">1. Cloning the Project</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Clone the project repository:</p>
              <CodeBlockWithCopy code="git clone https://github.com/agzaiyenth/SDGP-Connect.git" className="mb-4" />
              <p className="text-white/70 mb-4">Navigate into the project directory:</p>
              <CodeBlockWithCopy code="cd SDGP-Connect" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Installing Dependencies */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">2. Installing Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">We use <strong>Yarn</strong> instead of npm. Install all required packages:</p>
              <CodeBlockWithCopy code="yarn install" className="mb-4" />
              <p className="text-sm text-white/50">Note: Do not use npm. Stick to Yarn for dependency management.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Running the Project */}
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">3. Running the Project</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">To start the development server:</p>
              <CodeBlockWithCopy code="yarn run dev" className="mb-4" />
              <p className="text-white/70">This will launch your application on the local server & you can make the site look better</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <p className="text-center text-white/70 mt-12 max-w-2xl mx-auto">
        For more detailed setup instructions, environment variables, database setup, and advanced development workflows, please refer to the full documentation on our <a href="https://github.com/agzaiyenth/SDGP-Connect" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub repository</a>.
      </p>
    </motion.section>
  )
}
