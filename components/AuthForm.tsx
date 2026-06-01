// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { signIn, signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

const loginImages = [
  "/home/hero/dialog-ino.png",
  "/home/hero/movemate1.webp",
  "/home/hero/3.jpg",
]

const AuthForm: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center overflow-hidden bg-black text-zinc-200">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl px-4 sm:px-0"
      >
        {/* Split card container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-zinc-800 overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)]">
          {/* LEFT PANEL: Form */}
          <div className="bg-zinc-900 px-10 py-12 flex flex-col justify-between min-h-[520px]">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Image src="/iconw.svg" alt="Logo" width={40} height={40} className="h-25 w-25" />
            </motion.div>

            {/* Heading + form */}
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                  Welcome<br />
                  <span className="text-zinc-500">back.</span>
                </h1>
                <p className="mt-3 text-sm text-zinc-400">
                  Sign in to your account to continue
                </p>
              </div>
              <LoginForm />
            </div>

            {/* Footer */}
            <p className="text-xs text-zinc-600">© 2026 SDGP.lk · All rights reserved</p>
          </div>

          {/* RIGHT PANEL: Visual */}
          <RightPanel />
        </div>
      </motion.div>

      <BackgroundDecoration />
    </div>
  )
}

const BackButton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="fixed left-4 top-4 sm:left-8 sm:top-8 z-50" 
  >
    <Link href="/">
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800
        bg-zinc-900 px-4 py-2.5 font-medium text-zinc-200
        transition-all duration-300 hover:bg-zinc-800 active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600/40 w-fit"
      >
        <span className="text-zinc-400"><ChevronLeft size={16} /></span>
        <span>Go back</span>
      </button>
    </Link>
  </motion.div>
)

const getAuthErrorMessage = (error: string | null) => {
  if (!error || error === "undefined") {
    return "Sign-in failed. Please check the Asgardeo configuration and try again."
  }
  return `Sign-in failed (${error}). Please try again.`
}

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const callbackUrlFromQuery = searchParams.get("callbackUrl")
  const dashboardCallbackUrl = callbackUrlFromQuery ?? "/dashboard"
  const authError = searchParams.get("error")

  React.useEffect(() => {
    if (authError) {
      setError(getAuthErrorMessage(authError))
      toast.error("Sign-in failed.")
    }
  }, [authError])

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signOut({ redirect: false })
      await signIn("asgardeo", { callbackUrl: dashboardCallbackUrl })
    } catch {
      setLoading(false)
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
            {error}
          </p>
        </motion.div>
      )}

      {/* Asgardeo sign-in button */}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700
          bg-zinc-800 px-5 py-3.5 text-sm font-medium text-zinc-200
          transition-all duration-200 hover:bg-zinc-700 hover:border-zinc-600
          active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40"
      >
        {loading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200 shrink-0" />
            <span>Redirecting to Asgardeo...</span>
          </>
        ) : (
          <>
            {/* Asgardeo wordmark icon */}
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect width="40" height="40" rx="8" fill="#FF7300"/>
              <path d="M20 8L32 28H8L20 8Z" fill="white"/>
            </svg>
            <span>Continue with Asgardeo</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-600">
        Secure sign-in via WSO2 Asgardeo
      </p>
    </div>
  )
}

const RightPanel: React.FC = () => {
  const [current, setCurrent] = React.useState(0)
  const total = loginImages.length

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrent(prev => (prev + 1) % total)
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [current, total])

  return (
    <div className="relative hidden sm:flex flex-col justify-between bg-zinc-950 overflow-hidden p-8">
      {/* Image carousel */}
      <div className="absolute inset-0">
        {loginImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Hero"
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1500ms] ease-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top spacer — keeps layout consistent */}
      <div className="relative z-10" />

      {/* Bottom: dots + info card */}
      <div className="relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-4">
          {loginImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              className="h-1 w-8 rounded-full overflow-hidden bg-white/15 hover:bg-white/25 transition-colors duration-300 cursor-pointer"
            >
              <div
                className={`h-full bg-white rounded-full transition-all linear ${
                  i === current ? "w-full duration-[5000ms]" : "w-0 duration-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Info card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">Platform</p>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            Manage your Software Development Group Project — track progress, collaborate, and ship faster.
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              SDGP 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const BackgroundDecoration: React.FC = () => (
  <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#18181b,transparent)]" />
)

export default AuthForm