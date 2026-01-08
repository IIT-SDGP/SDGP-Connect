// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";
import React, { useState, useEffect } from "react";

interface CookieConsentData {
  choice: "accepted" | "rejected";
  timestamp: number;
  expiry: number;
}

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = getCookieConsent();
    if (!cookieConsent) {
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const getCookieConsent = (): string | null => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (consent) {
        const data: CookieConsentData = JSON.parse(consent);
        const now = new Date().getTime();
        if (now > data.expiry) {
          localStorage.removeItem("cookieConsent");
          return null;
        }
        return data.choice;
      }
    } catch (error) {
      console.error("Error reading cookie consent:", error);
    }
    return null;
  };

  const setCookieConsent = (choice: "accepted" | "rejected"): void => {
    try {
      const now = new Date().getTime();
      const expiry = now + 30 * 24 * 60 * 60 * 1000; 
      const consentData: CookieConsentData = {
        choice: choice,
        timestamp: now,
        expiry: expiry,
      };
      localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  const handleAccept = () => {
    setCookieConsent("accepted");
    closeBanner();
  };

  const handleDecline = () => {
    setCookieConsent("rejected");
    closeBanner();
  };

  const closeBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:max-w-4xl lg:max-w-5xl xl:max-w-6xl z-50 transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      <div className="bg-black/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-800/50 px-4 py-3 md:py-4 min-h-[60px] md:min-h-[70px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 h-full">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5 sm:mt-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-secondary-foreground"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5a2.5 2.5 0 0 1 5 0" />
                <path d="M16 15.5a2.5 2.5 0 1 1-5 0" />
              </svg>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              We use cookies to enhance your browsing experience and analyze
              site traffic. By continuing to use this site, you consent to our
              use of cookies.{" "}
              <a
                href="https://www.sdgp.lk/cookies"
                className="underline hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                View our cookie policy
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
            <button
              type="button"
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-200 text-xs sm:text-sm md:text-base font-medium transition-colors duration-200 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-800/50"
            >
              Decline
            </button>

            <button
              onClick={handleAccept}
              className="bg-blue-600 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-white text-xs sm:text-sm md:text-base font-medium px-4 sm:px-5 py-2 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;