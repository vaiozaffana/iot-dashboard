"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"

interface HeroIntroProps {
  onComplete: () => void
}

export function HeroIntro({ onComplete }: HeroIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timeline = gsap.timeline()

    // Hero entrance animation
    timeline
      .fromTo(
        ".hero-badge",
        { y: -50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      )
      .fromTo(".hero-title", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
      .fromTo(".hero-subtitle", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .fromTo(".hero-description", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
      .fromTo(
        ".hero-cta",
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
        "-=0.3",
      )
      .fromTo(".hero-stats", { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.5")

    return () => {
      timeline.kill()
    }
  }, [])

  const handleGetStarted = () => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      },
    })

    timeline
      .to(".hero-content", {
        y: -50,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.in",
      })
      .to(
        ".hero-background",
        {
          scale: 1.1,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.4",
      )
  }

  if (!isVisible) return null

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-30 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="hero-background absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div ref={heroRef} className="hero-content max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div className="hero-badge inline-flex items-center space-x-2 bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">Welcome to the Future of Home Monitoring</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 className="hero-title text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smart Home
          </span>
          <br />
          <span className="text-white">Monitoring</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2 className="hero-subtitle text-2xl md:text-3xl text-slate-300 font-light mb-6">
          Real-time Environmental Intelligence
        </motion.h2>

        {/* Description */}
        <motion.p className="hero-description text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Experience the next generation of home automation with our advanced sensor network. Monitor temperature,
          humidity, air quality, and more with stunning visualizations and intelligent alerts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 text-lg rounded-xl backdrop-blur-sm group bg-transparent"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div className="hero-stats grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { number: "6", label: "Environmental Sensors", suffix: "+" },
            { number: "24", label: "Hours Monitoring", suffix: "/7" },
            { number: "99.9", label: "Uptime Reliability", suffix: "%" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-slate-700/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {stat.number}
                <span className="text-lg">{stat.suffix}</span>
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
