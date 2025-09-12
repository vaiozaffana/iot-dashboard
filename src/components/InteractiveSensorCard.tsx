"use client"

import type React from "react"

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MiniChart } from "./MiniChart"
import { ProgressRing } from "./ProgressRing"
import { getSensorIcon, getSensorColor, getSensorStatus } from "@/lib/sensorUtils"
import type { SensorRange, SensorType } from "@/types/sensor"

interface InteractiveSensorCardProps {
  title: string
  value: number
  unit: string
  type: SensorType
  range: SensorRange
  delay: number
}

export function InteractiveSensorCard({ title, value, unit, type, range, delay }: InteractiveSensorCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const springValue = useSpring(value, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (latest) => Math.round(latest * 10) / 10)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  const { color, bgColor } = getSensorColor(type)
  const status = getSensorStatus(value, range, type)
  const Icon = getSensorIcon(type)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full cursor-pointer">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
          animate={{
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className={`absolute inset-0 opacity-0 ${bgColor} blur-2xl`}
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
            scale: isPressed ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-lg"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        <div className="relative p-6" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-xl ${bgColor} backdrop-blur-sm`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </motion.div>
              <div>
                <motion.h3
                  className="text-sm font-semibold text-slate-200 mb-1"
                  animate={{
                    color: isHovered ? "#ffffff" : "#cbd5e1",
                  }}
                >
                  {title}
                </motion.h3>
                <motion.div
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    status === "normal"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : status === "warning"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: delay + 0.3 }}
                >
                  {status}
                </motion.div>
              </div>
            </div>
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <ProgressRing value={value} range={range} type={type} size={50} />
            </motion.div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
              >
                {displayValue}
              </motion.span>
              <motion.span
                className="text-xl text-slate-400 font-medium"
                animate={{
                  color: isHovered ? "#94a3b8" : "#64748b",
                }}
              >
                {unit}
              </motion.span>
            </div>
            <motion.div
              className="text-xs text-slate-500 mt-1"
              animate={{
                opacity: isHovered ? 1 : 0.7,
              }}
            >
              Range: {range.min} - {range.max} {unit}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: delay + 0.4, duration: 0.5 }}
          >
            <motion.div
              className="text-xs text-slate-400 mb-2 font-medium"
              animate={{
                color: isHovered ? "#cbd5e1" : "#94a3b8",
              }}
            >
              Trend
            </motion.div>
            <motion.div
              animate={{
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <MiniChart type={type} currentValue={value} range={range} />
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
