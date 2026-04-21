// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowRight, Globe, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/LanguageProvider'

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/project',     label: 'Projects' },
  { href: '/competitions',label: 'Competition Winners' },
  { href: '/about',       label: 'About Us' },
  { href: '/contact',     label: 'Contact Us' },
]

export default function HomeNavbar() {
  const router   = useRouter()
  const pathname = usePathname()
  const { lang, changeLanguage } = useLanguage()
  const [open,    setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-5xl relative">
        {/* Ambient glow behind nav */}
        <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-blue-600/30 via-blue-400/10 to-blue-700/30 blur-xl transition-opacity duration-700 pointer-events-none ${scrolled ? 'opacity-100' : 'opacity-40'}`} />

        {/* ── Desktop / main bar ─────────────────────────────────── */}
        <nav
          aria-label="Main navigation"
          className={cn(
            'flex items-center justify-between rounded-2xl border px-5 transition-all duration-300 ease-in-out',
            scrolled
              ? 'h-14   border-white/8 bg-[rgba(8,8,10,0.95)] shadow-lg shadow-black/40 backdrop-blur-lg'
              : 'h-[62px] border-white/6 bg-[rgba(8,8,10,0.65)] shadow-md shadow-black/30 backdrop-blur-md'
          )}
        >

          {/* Logo ───────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex flex-shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
          >
            <img
              src="/test.svg"
              alt="SDGP"
              className={cn(
                'object-contain transition-all duration-300',
                scrolled ? 'h-7 w-14' : 'h-8 w-[62px]'
              )}
            />
          </Link>

          {/* Center links ───────────────────────────────────────── */}
          <ul
            className="hidden lg:flex items-center gap-0.5"
            role="list"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center rounded-lg px-3.5 py-[7px]',
                      'text-[13.5px] font-medium tracking-[0.01em]',
                      'transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
                      active
                        ? 'text-white bg-white/[0.07]'
                        : 'text-white/50 hover:text-white/90 hover:bg-white/[0.045]'
                    )}
                  >
                    {label}
                    {/* active dot indicator */}
                    {active && (
                      <span className="absolute bottom-[5px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full bg-white/50" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">

            {/* Language indicator – desktop */}
            <button
              onClick={() => {
                const all = ['en', 'si', 'th']
                changeLanguage(all[(all.indexOf(lang) + 1) % all.length])
              }}
              className={cn(
                'hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-[7px]',
                'text-[13px] font-medium text-white/50 hover:text-white/80',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
              )}
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
              {lang === 'si' ? 'සිං' : lang === 'th' ? 'த' : 'EN'}
            </button>

            {/* CTA – desktop */}
            <button
              onClick={() => router.push('/submit')}
              className={cn(
                'hidden lg:flex items-center gap-1.5 rounded-xl px-4 py-2',
                'text-sm font-semibold text-white',
                'bg-gradient-to-br from-blue-500 to-blue-700',
                'shadow-lg shadow-blue-900/50 hover:shadow-blue-700/60',
                'hover:from-blue-400 hover:to-blue-600 hover:-translate-y-0.5',
                'active:scale-[0.98]',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
              )}
            >
              Submit Details
              <ArrowRight className="h-3.5 w-3.5 opacity-80" strokeWidth={2.5} />
            </button>

            {/* Hamburger – mobile */}
            <button
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className={cn(
                'lg:hidden flex h-9 w-9 items-center justify-center rounded-lg',
                'border border-white/[0.08] bg-white/[0.04]',
                'text-white/55 hover:text-white hover:bg-white/[0.09]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25'
              )}
            >
              {open
                ? <X      className="h-4 w-4" strokeWidth={2} />
                : <Menu   className="h-4 w-4" strokeWidth={2} />
              }
            </button>
          </div>
        </nav>

        {/* ── Mobile drawer ──────────────────────────────────────── */}
        {open && (
          <div className="lg:hidden mt-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-[rgba(8,8,10,0.97)] shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">

            {/* Links */}
            <ul className="flex flex-col p-2" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[44px] items-center rounded-xl px-4 py-3',
                        'text-[14px] font-medium',
                        'transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25',
                        active
                          ? 'text-white bg-white/[0.08]'
                          : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05]'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* CTA – mobile */}
            <div className="border-t border-white/[0.06] p-3">
              <button
                onClick={() => { close(); router.push('/submit') }}
                className={cn(
                  'flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-3',
                  'text-[14px] font-semibold text-white',
                  'bg-gradient-to-br from-blue-500 to-blue-700',
                  'shadow-lg shadow-blue-900/50',
                  'hover:from-blue-400 hover:to-blue-600',
                  'active:scale-[0.98]',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
                )}
              >
                Submit Details
                <ArrowRight className="h-4 w-4 opacity-60" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
