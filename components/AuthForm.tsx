// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import * as React from "react"
import { ChevronLeft, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const AuthForm: React.FC = () => {
  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="grid overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/40 backdrop-blur-md lg:grid-cols-2">
          <div className="relative hidden min-h-[560px] border-r border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-10 lg:flex lg:items-center lg:justify-center">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="rounded-[2rem] bg-primary/12 p-7 ring-1 ring-primary/30 shadow-[0_0_60px_-20px_rgba(16,185,129,0.6)]">
                <Image src="/iconw.svg" alt="SDGP logo" width={220} height={220} />
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-tight text-zinc-100">SDGP Connect</h2>
              <p className="mt-2 text-sm text-zinc-400">Admin Workspace</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-sm text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure admin access
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <Logo />
            <Header />
            <LoginForm />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const BackButton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="absolute left-4 top-4 z-20 sm:left-8 sm:top-8"
  >
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/85 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
    >
      <ChevronLeft size={16} />
      Go back
    </Link>
  </motion.div>
)

const Logo: React.FC = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="mb-8 flex items-center justify-center lg:hidden"
  >
    <div className="rounded-3xl bg-primary/10 p-6 ring-1 ring-primary/25">
      <Image src="/iconw.svg" alt="Logo" width={156} height={156} />
    </div>
  </motion.div>
)

const Header: React.FC = () => (
  <div className="mb-8 text-center lg:text-left">
    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
    <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to the admin dashboard.</p>
  </div>
)

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForgotMessage, setShowForgotMessage] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      toast.error("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      toast.error("Password is required");
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
      
      }
      // Attempt to sign in using NextAuth credentials provider
      const result = await signIn("credentials", {
        name: username,
        password,
        redirect: false
      });


      if (result?.error) {
        setError(result.error);

        if (result.error.includes("User not found")) {
          toast.error("No user found with this username");
        } else if (result.error.includes("Invalid password")) {
          toast.error("Password is incorrect");
        } else {
          toast.error("Authentication failed");
        }
      } else if (result?.ok) {
        toast.success("Login successful!");
        router.push("/admin");  // Redirect to the dashboard on successful login
      }
    } catch (err) {
      console.error("SignIn Error:", err); // LOG
      setError("An error occurred during sign in");
      toast.error("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400"
        >
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-500" />
            {error}
          </p>
        </motion.div>
      )}
      {showForgotMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          <p>Please contact your administrator to reset your password.</p>
        </motion.div>
      )}
      <div className="space-y-2">
        <label
          htmlFor="username-input"
          className="block text-sm font-medium text-foreground/90"
        >
          Username
        </label>
        <input
          id="username-input"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 transition-colors duration-200 hover:border-zinc-600 focus:border-ring focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password-input"
            className="block text-sm font-medium text-foreground/90"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowForgotMessage(true)}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Forgot password?
          </button>
        </div>
        <input
          id="password-input"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 transition-colors duration-200 hover:border-zinc-600 focus:border-ring focus:outline-none"
        />
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};

export default AuthForm