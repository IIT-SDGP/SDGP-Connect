// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

export interface Marker {
  id: string
  location: [number, number]
  name: string
  users: number
}

interface GlobeProps {
  markers?: Marker[]
  className?: string
  speed?: number
}

export const defaultMarkers: Marker[] = [
  { id: "usa",       location: [37.77,  -122.42], name: "United States",        users: 3200 },
  { id: "uk",        location: [51.51,    -0.13], name: "United Kingdom",       users: 2400 },
  { id: "uae",       location: [25.2,    55.27],  name: "United Arab Emirates", users: 1400 },
  { id: "sri-lanka", location: [6.93,    79.86],  name: "Sri Lanka",            users: 950  },
  { id: "singapore", location: [1.35,   103.82],  name: "Singapore",            users: 1800 },
  { id: "japan",     location: [35.68,  139.65],  name: "Japan",                users: 1600 },
  { id: "australia", location: [-33.87, 151.21],  name: "Australia",            users: 1500 },
]

export function Globe({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0) return
      if (globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [0.1, 0.2, 0.45],
        glowColor: [0.94, 0.93, 0.91],
        markerElevation: 0,
        markers: markers.map((marker) => ({
          location: marker.location,
          size: 0.025,
          id: marker.id,
        })),
        arcs: [],
        arcColor: [0.15, 0.3, 0.55],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        globe?.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }

      animate()

      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1"
      })
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          resizeObserver.disconnect()
          init()
        }
      })
      resizeObserver.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />

      {!isMobile && markers.map((marker) => (
        <div
          key={marker.id}
          onClick={() => setExpanded(expanded === marker.id ? null : marker.id)}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${marker.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 6,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            padding: "10px 16px",
            background: "rgba(6, 32, 86, 0.85)",
            border: "1px solid rgba(59, 130, 246, 0.35)",
            borderRadius: 12,
            backdropFilter: "blur(10px)",
            color: "#fff",
            cursor: "pointer",
            minWidth: 110,
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            opacity: `var(--cobe-visible-${marker.id}, 0)` as any,
            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s, transform 0.2s",
            transform: expanded === marker.id ? "scale(1.05)" : "scale(1)",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#bfdbfe",
            }}
          >
            {marker.name}
          </span>

          {expanded === marker.id && (
            <>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  animation: "sdgp-fadeUp 0.2s ease-out",
                }}
              >
                {marker.users.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#71717a",
                  letterSpacing: "0.05em",
                }}
              >
                users
              </span>
              <div
                style={{
                  height: 2,
                  borderRadius: 2,
                  background: "rgba(59,130,246,0.15)",
                  marginTop: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                    width: `${Math.round((marker.users / 3200) * 100)}%`,
                    animation: "sdgp-shimmer 2.5s ease-in-out infinite",
                  }}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}