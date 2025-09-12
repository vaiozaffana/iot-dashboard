"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MiniChart } from "@/components/MiniChart"
import { ProgressRing } from "@/components/ProgressRing"
import { getSensorIcon, getSensorColor, getSensorStatus } from "@/lib/sensorUtils"
import type { SensorRange, SensorType } from "@/types/sensor"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  type: SensorType
  range: SensorRange
  delay: number
}

export function SensorCard({ title, value, unit, type, range, delay }: SensorCardProps) {
  const springValue = useSpring(value, { stiffness: 100, damping: 30 })
  const displayValue = useTransform(springValue, (latest) => Math.round(latest * 10) / 10)

  const { color, bgColor } = getSensorColor(type)
  const status = getSensorStatus(value, range, type)
  const Icon = getSensorIcon(type)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

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
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

        <div className={`absolute inset-0 opacity-20 ${bgColor} blur-3xl`} />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-xl ${bgColor} backdrop-blur-sm`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
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
                  transition={{ delay: delay + 0.3 }}
                >
                  {status}
                </motion.div>
              </div>
            </div>
            <ProgressRing value={value} range={range} type={type} size={50} />
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
              >
                {displayValue}
              </motion.span>
              <span className="text-xl text-slate-400 font-medium">{unit}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Range: {range.min} - {range.max} {unit}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: delay + 0.4, duration: 0.5 }}
          >
            <div className="text-xs text-slate-400 mb-2 font-medium">Trend</div>
            <MiniChart type={type} currentValue={value} range={range} />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
