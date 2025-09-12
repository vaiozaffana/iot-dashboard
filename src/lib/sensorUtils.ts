import { Thermometer, Droplets, Wind, Zap, Sun } from "lucide-react"
import type { SensorType, SensorRange } from "@/types/sensor"

export function getSensorIcon(type: SensorType) {
  switch (type) {
    case "temperature":
      return Thermometer
    case "humidity":
      return Droplets
    case "co":
    case "co2":
    case "nh4":
      return Wind
    case "light":
      return Sun
    default:
      return Zap
  }
}

export function getSensorColor(type: SensorType) {
  switch (type) {
    case "temperature":
      return { color: "text-orange-400", bgColor: "bg-orange-500/20" }
    case "humidity":
      return { color: "text-blue-400", bgColor: "bg-blue-500/20" }
    case "co":
      return { color: "text-red-400", bgColor: "bg-red-500/20" }
    case "co2":
      return { color: "text-yellow-400", bgColor: "bg-yellow-500/20" }
    case "nh4":
      return { color: "text-purple-400", bgColor: "bg-purple-500/20" }
    case "light":
      return { color: "text-cyan-400", bgColor: "bg-cyan-500/20" }
    default:
      return { color: "text-gray-400", bgColor: "bg-gray-500/20" }
  }
}

export function getSensorStatus(
  value: number,
  range: SensorRange,
  type: SensorType,
): "normal" | "warning" | "critical" {
  const percentage = (value - range.min) / (range.max - range.min)

  switch (type) {
    case "temperature":
      if (value < 20 || value > 28) return "warning"
      if (value < 18 || value > 30) return "critical"
      return "normal"

    case "humidity":
      if (value < 30 || value > 70) return "warning"
      if (value < 25 || value > 80) return "critical"
      return "normal"

    case "co":
      if (value > 30) return "critical"
      if (value > 15) return "warning"
      return "normal"

    case "co2":
      if (value > 1500) return "critical"
      if (value > 1000) return "warning"
      return "normal"

    case "nh4":
      if (value > 70) return "critical"
      if (value > 40) return "warning"
      return "normal"

    case "light":
      if (value < 100 || value > 800) return "warning"
      return "normal"

    default:
      return "normal"
  }
}
