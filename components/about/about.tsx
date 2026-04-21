// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Trophy, Building2, Globe, ArrowRight,
  CheckCircle2, Zap, Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/LanguageProvider'

/* ─── data ─────────────────────────────────────────────────── */

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj,
  )
}

const PROOF_ITEMS = [
  { icon: Trophy,    label: 'Award-winning projects'     },
  { icon: Building2, label: 'Industry-backed challenges' },
  { icon: Globe,     label: 'SDG-aligned solutions'      },
]

const PROJECTS = [
  {
    logo:        '/home/about-logo/movemate.webp',
    category:    'Logistics · AI',
    name:        'MoveMate',
    description: 'Real-time cargo matching platform connecting local freight with available carriers across Sri Lanka.',
    metric:      'Industry deployed',
  },
  {
    logo:        '/home/about-logo/sealanka.webp',
    category:    'Sustainability · Data',
    name:        'SeaLanka',
    description: 'Marine conservation monitoring system tracking ocean health indicators using IoT sensor networks.',
    metric:      'SDG 14 aligned',
  },
  {
    logo:        '/home/about-logo/lexi.webp',
    category:    'EdTech · NLP',
    name:        'Lexi',
    description: 'Adaptive language learning platform for Sinhala speakers with AI-powered quiz personalisation.',
    metric:      'Award winner',
  },
] as const

/* ─── motion config ─────────────────────────────────────────── */

const ITEM = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
}
const ITEM_STATIC = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
}

/* ─── sub-components ────────────────────────────────────────── */

function ProjectShowcase() {
  const rm = useReducedMotion() ?? false
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (rm) return
    const id = setInterval(() => setActive(p => (p + 1) % PROJECTS.length), 4000)
    return () => clearInterval(id)
  }, [rm])

  const proj = PROJECTS[active]

  const reveal = rm
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial:    { opacity: 0, y: 8 },
        animate:    { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
        exit:       { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
      }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

      {/* Image band — restrained radial gradient, no geometric shapes */}
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_60%_40%,rgba(30,58,122,0.18)_0%,transparent_70%)]">

        {/* Category — top left */}
        <span className="absolute left-4 top-4 rounded-full border border-white/[0.07] bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/45 backdrop-blur-sm">
          {proj.category}
        </span>

        {/* Metric — top right */}
        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300/80 backdrop-blur-sm">
          <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
          {proj.metric}
        </span>

        {/* Cycling logo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            {...reveal}
            className="flex items-center justify-center"
          >
            <Image
              src={proj.logo}
              alt={proj.name}
              width={72}
              height={72}
              className="h-14 w-auto object-contain opacity-85"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text content */}
      <div className="border-t border-white/[0.05] px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div key={active} {...reveal}>
            <p className="mb-1 text-[17px] font-semibold text-white">{proj.name}</p>
            <p className="text-[13px] leading-[1.65] text-white/48">{proj.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dot progress */}
        <div className="mt-4 flex items-center gap-2" role="tablist" aria-label="Projects">
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${p.name}`}
              onClick={() => setActive(i)}
              className={cn(
                'h-[3px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                i === active ? 'w-6 bg-white/55' : 'w-3 bg-white/14 hover:bg-white/28',
              )}
            />
          ))}
        </div>
      </div>

      {/* Non-active project rows */}
      <div className="border-t border-white/[0.04]">
        {PROJECTS.map((p, i) => {
          if (i === active) return null
          return (
            <button
              key={p.name}
              onClick={() => setActive(i)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-white/20"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={24}
                height={24}
                className="h-5 w-auto object-contain opacity-40"
              />
              <span className="text-[13px] font-medium text-white/35">{p.name}</span>
              <span className="text-[11px] text-white/22">{p.category}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── main component ────────────────────────────────────────── */

export function AboutSection() {
  const { t }  = useLanguage()
  const about   = getNested(t, ['home', 'about'], {})
  const vision  = about.vision_card  || {}
  const values  = about.values_card  || {}
  const mission = about.mission_card || {}

  const rm      = useReducedMotion() ?? false
  const item    = rm ? ITEM_STATIC : ITEM
  const stagger = rm ? {} : { transition: { staggerChildren: 0.08 } }

  return (
    <section className="relative w-full py-16 md:py-20 lg:py-28 text-white overflow-hidden" aria-label="About SDGP">
      {/* Decorative glow — mid right */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-blue-800/10 blur-[140px] pointer-events-none" />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">

        {/* ── Asymmetric 2-col hero ──────────────────────────── */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left: content stack (5 cols) */}
          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, visible: stagger }}
          >
            {/* IIT institutional strip */}
            <motion.div variants={item} className="mb-9 flex items-center gap-2.5">
              <Image
                src="/assets/logo.webp"
                alt="Informatics Institute of Technology"
                width={28}
                height={28}
                className="h-6 w-auto object-contain opacity-75"
              />
              <span className="h-4 w-px flex-shrink-0 bg-white/[0.14]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                <span className="hidden sm:inline">Informatics Institute of Technology</span>
                <span className="sm:hidden">IIT</span>
              </span>
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-white/20" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/65">
                SDGP
              </span>
            </motion.div>

            {/* Headline — line breaks are intentional at this column width */}
            <motion.h2
              variants={item}
              className="text-[38px] font-bold leading-[1.05] tracking-[-0.025em] text-white sm:text-[46px] lg:text-[52px]"
            >
              {about.heading || (
                <>Real projects.<br />Real impact.<br />Real careers.</>
              )}
            </motion.h2>

            {/* Para */}
            <motion.p
              variants={item}
              className="mt-5 max-w-[420px] text-[15px] leading-[1.75] text-white/58"
            >
              {about.description ||
                'Student teams tackle industry-grade challenges over a full academic year — shipping production software, presenting to real clients, and building a professional track record that opens doors.'}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/project"
                className="inline-flex items-center gap-2 rounded-full border border-[#253d82] bg-gradient-to-b from-[#2a5298] to-[#1c3872] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-150 hover:border-[#3162b8] hover:from-[#3162b8] hover:to-[#234899] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                Explore projects
                <ArrowRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2.5} />
              </Link>
              <Link
                href="/competitions"
                className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-6 py-2.5 text-[14px] font-medium text-white/65 transition-all duration-150 hover:bg-white/[0.08] hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              >
                See winning teams
              </Link>
            </motion.div>

            {/* Proof row */}
            <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {PROOF_ITEMS.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-2 text-white/40">
                  {i > 0 && <span className="mr-1 hidden h-3 w-px bg-white/[0.10] sm:block" />}
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-[12px] font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: live project showcase (7 cols) */}
          <motion.div
            className="lg:col-span-7"
            initial={rm ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: rm ? 0 : 0.22 }}
          >
            <ProjectShowcase />
          </motion.div>
        </div>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="mb-16 mt-20 h-px bg-white/[0.06]" />

        {/* ── Section heading ──────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center text-center">
          {/* Logo mark icon */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-2xl" />
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl">
              <img src="/iconw.svg" alt="SDGP" className="w-10 h-10" />
            </div>
          </div>
          <h2 className="mb-5 text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Crafting code for a{' '}
            <span className="text-[#3b82f6]">sustainable tomorrow</span>
          </h2>
          <p className="max-w-[520px] text-[15px] leading-[1.75] text-white/48">
            Build impactful tech solutions through teamwork, innovation, and purpose driven by SDGP and the UN SDGs.
          </p>
        </div>

        {/* ── 3 Vision / Values / Mission cards ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {[
            {
              icon: Globe,
              label: vision.title      || 'Our Vision',
              title: vision.sub_title  || 'Tech for global good',
              desc:  vision.description || 'To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software.',
            },
            {
              icon: Heart,
              label: values.title      || 'Our Core Values',
              title: values.sub_title  || 'Driven by purpose',
              desc:  values.description || 'We believe in innovation, collaboration, and meaningful impact. Our community thrives on solving real-world problems, learning continuously, and developing technology that serves humanity and the planet.',
            },
            {
              icon: Zap,
              label: mission.title     || 'Our Mission',
              title: mission.sub_title || 'Empowering Innovators',
              desc:  mission.description || 'To empower the next generation of socially-conscious developers by offering hands-on experience in building impactful full-stack applications that address real-world challenges aligned with the UN SDGs.',
            },
          ].map(({ icon: Icon, label, title, desc }) => (
            <div key={label} className="group/v relative p-7 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Hover glow orb */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl opacity-0 group-hover/v:opacity-100 transition-opacity duration-700" />
              {/* Icon box */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/10 border border-blue-500/20 mb-5 group-hover/v:scale-110 group-hover/v:rotate-3 transition-transform duration-500">
                <Icon className="h-5 w-5 text-blue-400" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-blue-400 mb-2">
                {label}
              </p>
              <p className="text-2xl font-bold mb-3">
                {title}
              </p>
              <p className="text-zinc-400 leading-relaxed text-[13px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
