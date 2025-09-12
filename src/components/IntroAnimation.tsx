"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import anime from "animejs"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<"loading" | "logo" | "particles" | "complete">("loading")

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500)
      },
    })

    // Stage 1: Loading animation with Anime.js
    anime({
      targets: ".loading-dot",
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      duration: 800,
      delay: anime.stagger(200),
      loop: 3,
      complete: () => {
        setStage("logo")
      },
    })

    // Stage 2: Logo reveal with GSAP
    timeline
      .to(".loading-container", { opacity: 0, duration: 0.5, delay: 2.5 })
      .set(".logo-container", { display: "block" })
      .fromTo(
        ".logo-text",
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        },
      )
      .fromTo(".logo-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .to(".logo-container", {
        scale: 0.8,
        opacity: 0.8,
        duration: 0.8,
        delay: 1,
      })
      .set(".particles-container", { display: "block" })
      .call(() => setStage("particles"))

    // Stage 3: Particle explosion with Anime.js
    setTimeout(() => {
      anime({
        targets: ".particle",
        translateX: () => anime.random(-800, 800),
        translateY: () => anime.random(-600, 600),
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        duration: 2000,
        delay: anime.stagger(50),
        easing: "easeOutExpo",
        complete: () => {
          setStage("complete")
        },
      })
    }, 4000)

    return () => {
      timeline.kill()
    }
  }, [onComplete])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Stage 1: Loading Animation */}
      <div className="loading-container absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="flex space-x-2 mb-8 justify-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="loading-dot w-4 h-4 bg-cyan-400 rounded-full" />
            ))}
          </div>
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Initializing Smart Home
          </motion.h2>
          <p className="text-slate-400">Preparing your dashboard...</p>
        </div>
      </div>

      {/* Stage 2: Logo Animation */}
      <div className="logo-container absolute inset-0 flex items-center justify-center hidden">
        <div className="text-center">
          <div className="logo-text text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            SmartHome
          </div>
          <div className="logo-subtitle text-xl text-slate-300 font-light">Intelligent Monitoring System</div>
        </div>
      </div>

      {/* Stage 3: Particle Animation */}
      <div ref={particlesRef} className="particles-container absolute inset-0 hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </motion.div>
  )
}
