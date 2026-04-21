// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Award, Rocket, TrendingUp, Users } from 'lucide-react'
import { useLanguage } from '@/hooks/LanguageProvider'

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj)
}

/* ── CountUp ────────────────────────────────────────────────── */
function CountUp({ value, rm }: { value: string; rm: boolean }) {
  const match  = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  const [count, setCount] = useState(rm ? target : 0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (rm || !inView) return
    const duration = 1800
    const start    = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, rm])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── variants ───────────────────────────────────────────────── */
const STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const STAT = {
  hidden:  { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}
const STATIC = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }

export default function ImpactStats() {
  const { t }  = useLanguage()
  const impact = getNested(t, ['home', 'impact_stats'], {})
  const rm     = useReducedMotion() ?? false
  const stat   = rm ? STATIC : STAT

  const stats = [
    { icon: Users,      number: impact.stat_1?.title       || '1000+', label: impact.stat_1?.description || 'Student Projects'   },
    { icon: Award,      number: impact.stat_2?.title       || '100+',  label: impact.stat_2?.description || 'Industry Partners'  },
    { icon: TrendingUp, number: impact.stat_3?.title       || '15+',   label: impact.stat_3?.description || 'SDGs Addressed'     },
    { icon: Rocket,     number: impact.stat_4?.title       || '75+',   label: impact.stat_4?.description || 'Startups Invested'  },
  ]

  return (
    <section className="relative w-full py-20 lg:py-28 text-white overflow-hidden" aria-label="Impact statistics">
      {/* Decorative dual radial gradients — left and right */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(37,99,235,0.15), transparent 40%), radial-gradient(circle at 80% 50%, rgba(29,78,216,0.15), transparent 40%)' }}
      />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">

        {/* Section header */}
        <motion.div
          initial={rm ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="mb-16 flex flex-col items-center gap-5 text-center"
        >
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300">
            {impact.title || 'Our Impact'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white">
            Numbers that tell our{' '}
            <span className="bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">story</span>
          </h2>
        </motion.div>

        {/* Stats grid — card layout */}
        <motion.div
          variants={rm ? {} : STAGGER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map(({ icon: Icon, number, label }, i) => (
            <motion.div
              key={i}
              variants={stat}
              className="group/s relative flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b from-[#0c0a09] to-[#050505] border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Card hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover/s:from-blue-500/5 group-hover/s:to-transparent transition-all duration-500" />

              {/* Icon box */}
              <div className="relative rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 mb-5 group-hover/s:scale-110 group-hover/s:bg-blue-500/20 transition-all duration-500">
                <Icon className="h-5 w-5 text-blue-400" strokeWidth={1.5} />
              </div>

              {/* Number */}
              <span className="relative text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent tabular-nums">
                <CountUp value={number} rm={rm} />
              </span>

              {/* Label */}
              <p className="relative text-sm text-gray-400 font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
