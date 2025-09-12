"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Home, Zap, Shield, Wifi } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: Home, title: "Smart Monitoring", desc: "Real-time environmental tracking" },
    { icon: Zap, title: "Instant Alerts", desc: "Immediate notifications for anomalies" },
    { icon: Shield, title: "Secure Data", desc: "End-to-end encrypted communications" },
    { icon: Wifi, title: "Always Connected", desc: "Reliable IoT sensor network" },
  ]

  useEffect(() => {
    const timeline = gsap.timeline()

    // Animate logo entrance
    timeline
      .fromTo(
        ".splash-logo",
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)" },
      )
      .fromTo(".splash-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
      .fromTo(".splash-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")

    // Feature showcase animation
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => {
        const next = (prev + 1) % features.length
        if (next === 0) {
          clearInterval(featureInterval)
          setTimeout(onComplete, 1000)
        }
        return next
      })
    }, 1500)

    return () => {
      timeline.kill()
      clearInterval(featureInterval)
    }
  }, [onComplete])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-40 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div className="splash-logo mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/25">
            <Home className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 className="splash-title text-4xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          SmartHome Monitor
        </motion.h1>

        <motion.p className="splash-subtitle text-slate-400 text-lg mb-12">
          Your intelligent home monitoring solution
        </motion.p>

        {/* Feature Showcase */}
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                  index === currentFeature
                    ? "bg-white/10 backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-500/10"
                    : "opacity-40"
                }`}
                initial={{ x: -50, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: index === currentFeature ? 1 : 0.4,
                  scale: index === currentFeature ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`p-3 rounded-lg ${
                    index === currentFeature ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {features.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentFeature ? "bg-cyan-400" : "bg-slate-600"
              }`}
              animate={{
                scale: index === currentFeature ? 1.5 : 1,
                opacity: index <= currentFeature ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  )
}
