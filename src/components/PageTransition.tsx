"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"

interface PageTransitionProps {
  onComplete: () => void
}

export function PageTransition({ onComplete }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 200)
      },
    })

    // Create morphing transition effect
    timeline
      .fromTo(
        ".transition-overlay",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
      )
      .to(
        ".transition-overlay",
        { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "power2.inOut" },
        "+=0.2",
      )

    // Particle burst effect
    gsap.fromTo(
      ".transition-particle",
      {
        scale: 0,
        opacity: 0,
        x: 0,
        y: 0,
      },
      {
        scale: 1,
        opacity: 1,
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        duration: 1,
        ease: "power2.out",
        stagger: 0.02,
        delay: 0.3,
      },
    )

    return () => {
      timeline.kill()
    }
  }, [onComplete])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Transition Overlay */}
      <div className="transition-overlay absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

      {/* Particle Effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="transition-particle absolute w-2 h-2 bg-white rounded-full" />
        ))}
      </div>

      {/* Loading Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-white text-xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Entering Dashboard...
        </motion.div>
      </div>
    </motion.div>
  )
}
