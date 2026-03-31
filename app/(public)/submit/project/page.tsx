// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'

import ProjectSubmissionForm from '@/components/submit-form/SubmissionForm'
import { MessageCircle, X } from 'lucide-react'

const Page = () => {
  const { status } = useSession()
  const [showPopup, setShowPopup] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Redirect unauthenticated users to login, returning here after
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/submit/project' })
    }
  }, [status])

  const handleAgree = () => {
    setShowPopup(false)
    setTermsAccepted(true)
  }

  // Show help popup after 10 seconds of accepting terms
  useEffect(() => {
    if (termsAccepted) {
      const timer = setTimeout(() => {
        setShowHelpPopup(true)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [termsAccepted])

  const closeHelpPopup = () => {
    setShowHelpPopup(false)
  }

  // Show a neutral loading state while session is resolving or redirecting
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Checking authentication…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Terms and Conditions Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-[#0f0f0f] text-white p-6 md:p-8 rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700">
            <h2 className="text-2xl font-bold mb-5 text-center text-white">Submission Instructions</h2>
            <ul className="list-disc pl-5 space-y-3 text-neutral-300 text-sm md:text-base">
              <li>All submissions will be <strong>carefully reviewed</strong> and approved/rejected.</li>
              <li><strong>It might take 0 – 2 days</strong> to review each project.</li>
              <li><strong>Failure to submit</strong> your project may impact your academic marks.</li>
              <li>Any <strong>one member</strong> from the team should submit the form.</li>
              <li>Once submitted, <strong>you cannot edit</strong> it. Resubmit if you need to make changes.</li>
              <li>You must include your project's <strong>Cover Image</strong>.</li>
              <li>A minimum of <strong>3 Gallery Images</strong> is required.</li>
              <li>Submitting <strong>Contact Number & Email address</strong> is mandatory.</li>
              <li>After submission, you may <strong>review</strong> your entry.</li>
              <li>Approved projects will receive a confirmation <strong>email</strong> to the provided email address.</li>
              <li>If rejected, read the feedback and <strong>resubmit</strong> correctly.</li>
              <li><strong>Providing false information is an offense.</strong></li>
            </ul>
            <div className="text-center mt-6">
              <button
                onClick={handleAgree}
                className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-lg text-white text-sm font-medium border border-neutral-600"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelpPopup && (
        <div className="fixed bottom-20 right-4 z-40 max-w-[260px] animate-in slide-in-from-bottom-5 duration-700 ease-out">
          <div className="relative bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl">
            <button
              onClick={closeHelpPopup}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-3 h-3 text-neutral-300" />
            </button>

            <div className="pr-5">
              <h3 className="text-white text-sm font-medium mb-1">Need Help?</h3>
              <p className="text-neutral-300 text-xs mb-2 whitespace-nowrap">
                Having trouble? Chat with us on WhatsApp!
              </p>
              <a
                href="https://wa.me/94766867362"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                <MessageCircle className="w-3 h-3" />
                Chat Now
              </a>
            </div>

            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-800"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Project Submission
            </h1>
            <p className="text-lg text-neutral-400">
              Share your innovative project with the community
            </p>
          </div>
          <ProjectSubmissionForm />
        </div>
      </div>

      <div
        className="fixed bottom-4 right-4 z-50 hidden md:flex flex-col items-end group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {!showHelpPopup && (
          <div
            className={`mb-2 max-w-[200px] px-3 py-1.5 rounded-md bg-neutral-800 text-white text-xs text-center shadow-md transition-all duration-300 ease-out transform ${showTooltip
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
          >
            Need help? Chat on WhatsApp
          </div>
        )}

        <a
          href="https://wa.me/94766867362"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center shadow-lg hover:shadow-green-500/20 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  )
}

export default Page