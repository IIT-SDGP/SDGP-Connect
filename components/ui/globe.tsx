// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

export interface Marker {
  id: string
  location: [number, number]
  size?: number
}

interface GlobeProps {
  markers?: Marker[]
  className?: string
  speed?: number
}

export const defaultMarkers: Marker[] = [
  { id: "usa",       location: [37.77,  -122.42] },
  { id: "uk",        location: [51.51,    -0.13] },
  { id: "uae",       location: [25.2,    55.27]  },
  { id: "sri-lanka", location: [6.93,    79.86]  },
  { id: "singapore", location: [1.35,   103.82]  },
  { id: "japan",     location: [35.68,  139.65]  },
  { id: "australia", location: [-33.87, 151.21]  },
]

export function Globe({
  markers = defaultMarkers,
  className = "",
  speed = 0.006,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

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

    function init(width: number) {
      if (globe) {
        globe.destroy()
        globe = null
      }

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 0.4,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.024, 0.125, 0.337],
        markerColor: [0.024, 0.714, 0.831],
        glowColor: [0.231, 0.510, 0.973],
        markerElevation: 0,
        markers: markers.map((marker) => ({
          location: marker.location,
          size: marker.size ?? 0.025,
        })),
        arcs: [],
        arcColor: [0.024, 0.714, 0.831],
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

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width === 0) return
      if (animationId) cancelAnimationFrame(animationId)
      init(width)
    })

    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
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
    </div>
  )
}