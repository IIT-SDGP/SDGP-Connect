// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  uploadDate: string
}

interface VideoCardProps {
  video: Video
  onPlay: (video: Video) => void
}

const CardSkeleton = () => (
  <div className="relative bg-zinc-900 rounded-lg" style={{ aspectRatio: "9/16" }}>
    <div
      className="w-full h-full bg-zinc-800"
      style={{
        background: "linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite",
      }}
    />
    <style jsx>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
)

export function VideoCard({ video, onPlay }: VideoCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!isVisible) {
    return (
      <div ref={cardRef}>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div
      className="relative bg-zinc-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
      style={{ aspectRatio: "9/16" }}
      onClick={() => onPlay(video)}
    >
      {!imageLoaded && <CardSkeleton />}

      <Image
        src={video.thumbnail || "/placeholder.svg"}
        alt={video.title}
        fill
        className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        onLoad={() => setImageLoaded(true)}
      />

      {imageLoaded && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3
              className="text-white text-sm font-medium"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {video.title}
            </h3>
          </div>
        </>
      )}
    </div>
  )
}
