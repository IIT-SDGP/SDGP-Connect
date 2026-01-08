// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules"
import { Button } from "../ui/button"
import { useGetFeaturedProjects } from "@/hooks/project/useGetFeaturedProjects"
import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { useRef, useEffect, useState } from "react"

// Define the project type
interface Project {
  id: string
  title: string
  subtitle: string
  coverImage: string
  status: string
  projectTypes: string[]
}

export default function Featured() {
  const { featuredProjects, isLoading, error } = useGetFeaturedProjects()
  const swiperRef = useRef<any>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldAutoplay, setShouldAutoplay] = useState(false)

  // Intersection Observer to pause/resume carousel when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        setShouldAutoplay(entry.isIntersecting)
        
        if (swiperRef.current) {
          if (entry.isIntersecting) {
            swiperRef.current.autoplay?.start()
          } else {
            swiperRef.current.autoplay?.stop()
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Pause on user interaction
  const handleUserInteraction = () => {
    setShouldAutoplay(false)
    if (swiperRef.current) {
      swiperRef.current.autoplay?.stop()
    }
  }

  // Resume autoplay after user stops interacting
  const handleMouseLeave = () => {
    if (isVisible) {
      setShouldAutoplay(true)
      if (swiperRef.current) {
        swiperRef.current.autoplay?.start()
      }
    }
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShouldAutoplay(false)
        if (swiperRef.current) {
          swiperRef.current.autoplay?.stop()
        }
      } else if (isVisible) {
        setShouldAutoplay(true)
        if (swiperRef.current) {
          swiperRef.current.autoplay?.start()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isVisible])

  if (error || (featuredProjects.length === 0 && !isLoading)) {
    return null
  }

  // Create skeleton projects for loading state
  const skeletonProjects: Partial<Project>[] = Array.from({ length: 3 }, (_, i) => ({ id: `skeleton-${i}` }))
  const displayProjects = isLoading ? skeletonProjects : featuredProjects

  return (
    <section 
      ref={sectionRef}
      className="py-[60px] sm:py-[100px] bg-[#0c0a09] relative -mt-[150px] overflow-hidden mt-2"
    >
      <style jsx global>{`
        @keyframes smoothGlow {
          0% {
            box-shadow: 0 15px 30px rgba(42, 82, 152, 0.2),
              0 0 0 1px rgba(42, 82, 152, 0.1);
          }
          50% {
            box-shadow: 0 20px 40px rgba(42, 82, 152, 0.4),
              0 0 20px rgba(42, 82, 152, 0.2),
              0 0 0 1px rgba(42, 82, 152, 0.2);
          }
          100% {
            box-shadow: 0 15px 30px rgba(42, 82, 152, 0.2),
              0 0 0 1px rgba(42, 82, 152, 0.1);
          }
        }

        .swiper-slide-active .project-card {
          animation: ${isVisible ? 'smoothGlow 5s infinite cubic-bezier(0.4, 0, 0.2, 1)' : 'none'};
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-12 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text px-4">
          Featured Projects
        </h2>

        <div 
          onMouseEnter={handleUserInteraction}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleUserInteraction}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop
            autoplay={shouldAutoplay ? {
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            } : false}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2.3, spaceBetween: 24 },
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full pb-20 pt-4"
          >
            {/* Fade overlays */}
            <div className="absolute top-0 left-0 h-full w-20 z-10 bg-gradient-to-r from-[#0c0a09] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-20 z-10 bg-gradient-to-l from-[#0c0a09] to-transparent pointer-events-none" />

            {displayProjects.map((project, index) => (
              <SwiperSlide key={project?.id || index} className="px-1 sm:px-2 md:px-3 py-2">
                <Link href={`/project/${project?.id || "#"}`}>
                  <div className="project-card bg-[#0c0a09] bg-opacity-70 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all hover:scale-[1.02] hover:z-20 duration-300 w-[320px] sm:w-[360px] lg:w-[420px] mx-auto relative">
                    {/* Image */}
                    <div className="relative h-[200px] sm:h-[220px] lg:h-[260px] w-full overflow-hidden">
                      {project?.status && (
                        <span className="absolute top-4 right-4 z-10 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md backdrop-blur">
                          {project.status}
                        </span>
                      )}
                      {project?.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title || 'Project'}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover"
                          loading={index < 3 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-[1]" />
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 flex flex-col gap-2 min-h-[140px] sm:min-h-[160px]">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {project?.title || <div className="w-1/2 h-5 sm:h-6 bg-gray-700 rounded animate-pulse" />}
                      </h3>
                      
                      {project?.subtitle ? (
                        <p className="text-xs sm:text-sm text-white/70 line-clamp-3">
                          {project.subtitle}
                        </p>
                      ) : (
                        <div className="text-xs sm:text-sm">
                          <div className="w-full h-3 sm:h-4 bg-gray-700 rounded animate-pulse" />
                        </div>
                      )}

                      {/* Project types */}
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                        {project?.projectTypes?.map((type, i) => (
                          <span
                            key={i}
                            className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm shadow-sm hover:bg-primary/20 transition"
                          >
                            {type}
                          </span>
                        )) || (isLoading && (
                          <>
                            <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse" />
                            <div className="w-20 h-6 bg-gray-700 rounded-full animate-pulse" />
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link href="/project">
            <Button className="mt-2">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}