"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { sidebarItems } from '@/data/NavBarItems'

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navItems = sidebarItems.filter((item) => item.href !== '/submit')

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="fixed top-2 left-0 right-0 z-50 px-4 md:px-6">
      <div className="max-w-[95%] mx-auto">
        <div className="relative group/header">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1d4ed8]/10 via-transparent to-[#2563eb]/10 rounded-2xl blur-xl opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />

          {/* Main header container */}
          <div className="relative bg-black/40 backdrop-blur-3xl rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-300">
            <div className="flex items-center justify-between px-6 py-3">
              {/* Logo Section */}
              <a href="/" className="flex items-center gap-3 group/logo cursor-pointer flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1d4ed8]/25 via-[#2563eb]/15 to-transparent rounded-lg blur-lg group-hover/logo:blur-xl opacity-0 group-hover/logo:opacity-100 transition-all duration-300" />
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1d4ed8]/15 to-transparent p-0.5">
                    <img
                      src="/test.svg"
                      alt="SDGP"
                      className="w-20 h-10 rounded-lg object-contain relative z-10 transform group-hover/logo:scale-105 transition-all duration-300"
                    />
                  </div>
                </div>
              </a>

              {/* Center Navigation */}
              <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
                <nav className="flex items-center gap-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                  className="lg:hidden p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 group/mobile"
                >
                  <svg
                    className="w-5 h-5 transform group-hover/mobile:scale-110 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>

                {/* Submit Details Button */}
                <div className="relative group/button hidden lg:block">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1f467f] via-[#2a5298] to-[#3b6eb3] rounded-full blur opacity-25 group-hover/button:opacity-45 transition-all duration-300" />

                  <Button
                    onClick={() => router.push('/submit')}
                    className="relative bg-[#2a5298]/20 hover:bg-[#2a5298]/30 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border border-[#2a5298]/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Submit Details
                      <svg
                        className="w-4 h-4 transform group-hover/button:translate-x-0.5 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
              <div className="lg:hidden border-t border-white/10 px-6 pb-5 pt-4 bg-black/55 backdrop-blur-3xl rounded-b-2xl">
                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 py-2"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="relative group/button mt-2">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1f467f] via-[#2a5298] to-[#3b6eb3] rounded-full blur opacity-25 group-hover/button:opacity-45 transition-all duration-300" />

                    <Button
                      onClick={() => {
                        closeMobileMenu()
                        router.push('/submit')
                      }}
                      className="relative w-full bg-[#2a5298]/20 hover:bg-[#2a5298]/30 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border border-[#2a5298]/30"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Submit Details
                        <svg
                          className="w-4 h-4 transform group-hover/button:translate-x-0.5 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
