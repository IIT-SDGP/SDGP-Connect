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

const AuthForm: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center overflow-hidden bg-black text-zinc-200">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg px-4 sm:px-0"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.5)] sm:p-12">
          <Logo />
          <Header />
          <React.Suspense fallback={<RedirectingState />}>
            <LoginForm />
          </React.Suspense>
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
    className="absolute left-4 top-4 sm:left-8 sm:top-8"
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

const Logo: React.FC = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mb-10 flex justify-center items-center"
  >
    <div className="relative">
      <Image
        src="/iconw.svg"
        alt="Logo"
        className="h-48 w-48 -mb-12"
        width={88}
        height={88}
      />
    </div>
  </motion.div>
)

const Header: React.FC = () => (
  <div className="mb-10 text-center">
    <h1 className="text-4xl font-bold text-white">Welcome back</h1>
    <p className="mt-3 text-lg text-zinc-400">Sign in to your account to continue</p>
  </div>
)

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const [error, setError] = React.useState("")
  const callbackUrlFromQuery = searchParams.get("callbackUrl")
  const studentCallbackUrl = callbackUrlFromQuery ?? "/student"
  const authError = searchParams.get("error")

  React.useEffect(() => {
    if (authError) {
      setError(`Sign-in failed (${authError}). Please try again.`)
      toast.error("Sign-in failed.")
      return
    }

    const signInWithAsgardeo = async () => {
      await signOut({ redirect: false })
      await signIn("asgardeo", { callbackUrl: studentCallbackUrl })
    }

    signInWithAsgardeo()
  }, [])

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400"
        >
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-400" />
            {error}
          </p>
        </motion.div>
      )}

      {!error && <RedirectingState />}
    </div>
  )
}

const RedirectingState: React.FC = () => (
  <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
    <div className="size-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200" />
    <span>Redirecting to Asgardeo...</span>
  </div>
)

const BackgroundDecoration: React.FC = () => (
  <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#18181b,transparent)]" />
)

export default AuthForm
