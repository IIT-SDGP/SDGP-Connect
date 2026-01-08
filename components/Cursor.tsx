// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useEffect, useState, useRef } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(true)

  // Use a ref for the animation frame to properly clean up
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Hide cursor initially until we get the first mouse movement
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseenter", onMouseEnter)
      document.addEventListener("mouseleave", onMouseLeave)
      document.addEventListener("mousedown", onMouseDown)
      document.addEventListener("mouseup", onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    // Track when hovering over links or buttons
    const handleLinkHoverEvents = () => {
      document.querySelectorAll("a, button, [role=button]").forEach((el) => {
        el.addEventListener("mouseenter", () => setLinkHovered(true))
        el.addEventListener("mouseleave", () => setLinkHovered(false))
      })
    }

    // Hide default cursor
    document.body.style.cursor = "none"

    // Add all event listeners
    addEventListeners()
    handleLinkHoverEvents()

    // Animate the trailing circle
    const animateTrail = () => {
      setTrailPosition((prevPos) => {
        // Calculate the distance between current position and trail position
        const dx = position.x - prevPos.x
        const dy = position.y - prevPos.y

        // Move the trail position 10% of the way to the current position
        return {
          x: prevPos.x + dx * 0.1,
          y: prevPos.y + dy * 0.1,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animateTrail)
    }

    animationFrameRef.current = requestAnimationFrame(animateTrail)

    // Cleanup
    return () => {
      removeEventListeners()
      document.body.style.cursor = "auto"

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [position])

  // Add event listener for links and buttons after the component mounts
  useEffect(() => {
    const handleLinkHoverEvents = () => {
      document.querySelectorAll("a, button, [role=button]").forEach((el) => {
        el.addEventListener("mouseenter", () => setLinkHovered(true))
        el.addEventListener("mouseleave", () => setLinkHovered(false))
      })
    }

    // We need to add a small delay to ensure all elements are rendered
    const timeout = setTimeout(() => {
      handleLinkHoverEvents()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          hidden ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div
          className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
            clicked ? "scale-90" : linkHovered ? "scale-150" : "scale-100"
          }`}
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#17629f", 
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
          }}
        />

        {/* Outer ring */}
        <div
          className={`absolute rounded-full border-2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            clicked ? "scale-75 opacity-30" : linkHovered ? "scale-125 opacity-70" : "scale-100 opacity-50"
          }`}
          style={{
            width: "36px",
            height: "36px",
            borderColor: "#17629f",
          }}
        />
      </div>

      {/* Trailing circle with delay */}
      <div
        className="fixed pointer-events-none z-40 opacity-30 rounded-full"
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
          width: "50px",
          height: "50px",
          backgroundColor: "transparent",
          border: "2px solid #17629f",
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s",
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
        }}
      />
    </>
  )
}
