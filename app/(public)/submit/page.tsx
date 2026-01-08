// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { ShimmerButton } from '@/components/magicui/shimmer-button';
import SpotlightCard from '@/components/ui/spotlightCards';
import { Award, Rocket, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';


const Page = () => {
  useEffect(() => {
      document.querySelectorAll('.line-animation-path').forEach((element) => {
        if (element instanceof SVGPathElement) {
          const len = element.getTotalLength();
          element.style.setProperty('--path-length', `${len}`);
        }
      });
    }, []);
  return (
   <div className="relative text-white font-sans overflow-x-hidden flex items-center justify-center min-h-screen py-20 px-5">
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Corner Animations */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-[80px]">
          {/* Left corner */}
          <div className="absolute w-[200px] h-[80px] left-[-120px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 177 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-background"
                d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 177 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-animation-path"
                d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
              />
            </svg>
          </div>

          {/* Right corner */}
          <div className="absolute w-[200px] h-[80px] right-[-120px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 176 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-background"
                d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 176 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-animation-path reverse"
                d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
              />
            </svg>
          </div>
        </div>

        {/* Background Stripe Lines */}
        {/* Line 1 (15%) */}
        <div className="absolute w-full h-[77px] top-[15%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-1">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-1)"
                  />
                </mask>
              </defs>
              <path
                d="M0 1H179.567L254.595 76H1081.4L1156.43 1H1336"
                stroke="rgba(255, 255, 255, 0.1)"
                mask="url(#gradient-mask-1)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H179.567L254.595 76H1081.4L1156.43 1H1336" stroke="rgba(255, 255, 255, 0.05)" />
            </svg>
          </div>
        </div>

        {/* Line 2 (35%) */}
        <div className="absolute w-full h-[98px] top-[35%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-2">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-2">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-2)"
                  />
                </mask>
              </defs>
              <path
                d="M0 1H107.5L182.528 97H1154L1229.03 1H1336"
                stroke="#007aff"
                mask="url(#gradient-mask-2)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H107.5L182.528 97H1154L1229.03 1H1336" stroke="rgba(255, 255, 255, 0.05)" />
            </svg>
          </div>
        </div>

        {/* Line 3 (55%) */}
        <div className="absolute w-full h-[98px] top-[55%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-3">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-3">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-3)"
                  />
                </mask>
              </defs>
              <path
                d="M0 97H107.5L182.528 1H1154L1229.03 97H1336"
                stroke="#007aff"
                mask="url(#gradient-mask-3)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 97H107.5L182.528 1H1154L1229.03 97H1336" stroke="rgba(255, 255, 255, 0.05)" />
            </svg>
          </div>
        </div>

        {/* Line 4 (75%) */}
        <div className="absolute w-full h-[77px] top-[75%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-4">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-4">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-4)"
                  />
                </mask>
              </defs>
              <path
                d="M1336 76H1156.43L1081.4 1H254.595L179.567 76H0"
                stroke="#007aff"
                mask="url(#gradient-mask-4)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1336 76H1156.43L1081.4 1H254.595L179.567 76H0" stroke="rgba(255, 255, 255, 0.05)" />
            </svg>
          </div>
        </div>
      </div>

       <div className="relative z-20 max-w-screen-xl w-full text-center">
        <h2 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-tight mb-12">
          Ready to share<br />
          <span className="bg-gradient-to-r from-[#061bd4] via-[#266fbe] to-[#a8c8eb] bg-clip-text text-transparent">
            your journey of impact?
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 102, 255, 0.2)">
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-10 h-10 text-white " />
              </div>
              <h3 className="text-2xl font-bold mb-3">Submit a Project</h3>
              <p className="text-gray-300 text-md mb-4 leading-relaxed">
                Share your innovation, research, or development work. Projects of all scopes are welcome.
              </p>
              <Link href="/submit/project">
                <ShimmerButton>Submit Project</ShimmerButton>
              </Link>
            </div>
          </SpotlightCard>

          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 153, 255, 0.2)">
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-10 h-10 text-white " />
              </div>
              <h3 className="text-2xl font-bold mb-3">Submit a Competition</h3>
              <p className="text-gray-300 text-md mb-4 leading-relaxed">
                Participated in a hackathon or tech challenge? Let your competitive spirit shine.
              </p>
              <Link href="/submit/competition">
                <ShimmerButton>Submit Competition</ShimmerButton>
              </Link>
            </div>
          </SpotlightCard>

          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 204, 255, 0.2)">
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-10 h-10 text-white " />
              </div>
              <h3 className="text-2xl font-bold mb-3">Submit an Award</h3>
              <p className="text-gray-300 text-md mb-4 leading-relaxed">
                Been recognized for your achievements? Add your award to our showcase.
              </p>
              <Link href="/submit/award">
                <ShimmerButton>Submit Award</ShimmerButton>
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}

export default Page