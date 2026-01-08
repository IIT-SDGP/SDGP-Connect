// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { motion } from "framer-motion"
import ElegantShape from "@/components/contribute/elegant-shape" 
import WhatIsSdgp from "@/components/contribute/what-is-sdgp"
import CommunityCards from "@/components/contribute/community-cards"
import ReportingIssues from "@/components/contribute/reporting-issues"
import ContributingGuideSections from "@/components/contribute/contributing-guide-sections"

/**
 * ElegantShape component for background geometric animations.
 * Uses framer-motion for initial animation and continuous floating effect.
 */
// function ElegantShape({
//   className,
//   delay = 0,
//   width = 400,
//   height = 100,
//   rotate = 0,
//   gradient = "from-white/[0.03]", // Default subtle gradient for dark theme
// }: {
//   className?: string
//   delay?: number
//   width?: number
//   height?: number
//   rotate?: number
//   gradient?: string
// }) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: -150,
//         rotate: rotate - 15,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//         rotate: rotate,
//       }}
//       transition={{
//         duration: 2.4,
//         delay,
//         ease: [0.23, 0.86, 0.39, 0.96],
//         opacity: { duration: 1.2 },
//       }}
//       className={cn("absolute", className)}
//     >
//       <motion.div
//         animate={{
//           y: [0, 15, 0], // Floating animation
//         }}
//         transition={{
//           duration: 12,
//           repeat: Number.POSITIVE_INFINITY,
//           ease: "easeInOut",
//         }}
//         style={{
//           width,
//           height,
//         }}
//         className="relative"
//       >
//         <div
//           className={cn(
//             "absolute inset-0 rounded-full",
//             "bg-gradient-to-r to-transparent",
//             gradient,
//             "backdrop-blur-[2px] border-2 border-white/[0.05]", // Subtle border
//             "shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]", // Subtle shadow
//             "after:absolute after:inset-0 after:rounded-full",
//             "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]", // Subtle inner glow
//           )}
//         />
//       </motion.div>
//     </motion.div>
//   )
// }

export default function ContributePage() {
  // Variants for cards to animate into view as user scrolls
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030303] text-white w-screen">
      {/* Background geometric shapes with adjusted gradients for black theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/[0.05] via-transparent to-gray-800/[0.05] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden ">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-gray-700/[0.1]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-gray-800/[0.1]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-gray-600/[0.1]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Main content wrapper with overall page entry animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-4 md:px-6 max-w-5xl"
      >
        <WhatIsSdgp cardVariants={cardVariants} />
        <CommunityCards cardVariants={cardVariants} />
        <ReportingIssues cardVariants={cardVariants} />
        <ContributingGuideSections cardVariants={cardVariants} />
      </motion.div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
