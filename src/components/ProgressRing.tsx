"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import type { SensorType, SensorRange } from "@/types/sensor"

interface ProgressRingProps {
  value: number
  range: SensorRange
  type: SensorType
  size?: number
}

export function ProgressRing({ value, range, type, size = 60 }: ProgressRingProps) {
  const percentage = useMemo(() => {
    return Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100))
  }, [value, range])

  const circumference = 2 * Math.PI * (size / 2 - 8)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getStrokeColor = (type: SensorType) => {
    switch (type) {
      case "temperature":
        return "#fb7185"
      case "humidity":
        return "#60a5fa"
      case "co":
        return "#f87171"
      case "co2":
        return "#fbbf24"
      case "nh4":
        return "#a78bfa"
      case "light":
        return "#22d3ee"
      default:
        return "#64748b"
    }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="4"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          stroke={getStrokeColor(type)}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
