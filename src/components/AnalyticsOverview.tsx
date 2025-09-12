"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import { getSensorHistory } from "@/lib/sensorData"
import type { SensorData } from "@/types/sensor"

interface AnalyticsOverviewProps {
  currentData: SensorData
}

export function AnalyticsOverview({ currentData }: AnalyticsOverviewProps) {
  const analytics = useMemo(() => {
    const sensors: Array<keyof SensorData> = ["temperature", "humidity", "co", "co2", "nh4", "light"]

    return sensors
      .map((sensor) => {
        const history = getSensorHistory(sensor)
        if (history.length < 2) return null

        const current = history[history.length - 1]?.value || 0
        const previous = history[history.length - 2]?.value || 0
        const change = ((current - previous) / previous) * 100

        const recent = history.slice(-10)
        const average = recent.reduce((sum, item) => sum + item.value, 0) / recent.length

        let status: "good" | "warning" | "critical" = "good"

        switch (sensor) {
          case "temperature":
            if (current < 18 || current > 30) status = "critical"
            else if (current < 20 || current > 28) status = "warning"
            break
          case "humidity":
            if (current < 25 || current > 80) status = "critical"
            else if (current < 30 || current > 70) status = "warning"
            break
          case "co":
            if (current > 30) status = "critical"
            else if (current > 15) status = "warning"
            break
          case "co2":
            if (current > 1500) status = "critical"
            else if (current > 1000) status = "warning"
            break
          case "nh4":
            if (current > 70) status = "critical"
            else if (current > 40) status = "warning"
            break
          case "light":
            if (current < 100) status = "warning"
            break
        }

        return {
          sensor,
          current,
          change,
          average,
          status,
          trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
        }
      })
      .filter(Boolean)
  }, [currentData])

  const overallStatus = useMemo(() => {
    const criticalCount = analytics.filter((item) => item?.status === "critical").length
    const warningCount = analytics.filter((item) => item?.status === "warning").length

    if (criticalCount > 0) return "critical"
    if (warningCount > 2) return "warning"
    return "good"
  }, [analytics])

  const getSensorLabel = (sensor: string) => {
    switch (sensor) {
      case "temperature":
        return "Temperature"
      case "humidity":
        return "Humidity"
      case "co":
        return "CO"
      case "co2":
        return "CO₂"
      case "nh4":
        return "NH₄"
      case "light":
        return "Light"
      default:
        return sensor
    }
  }

  const getUnit = (sensor: string) => {
    switch (sensor) {
      case "temperature":
        return "°C"
      case "humidity":
        return "%"
      case "co":
      case "co2":
      case "nh4":
        return "ppm"
      case "light":
        return "lux"
      default:
        return ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">System Analytics</h3>
            <div className="flex items-center gap-2">
              {overallStatus === "good" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle
                  className={`w-5 h-5 ${overallStatus === "critical" ? "text-red-400" : "text-amber-400"}`}
                />
              )}
              <span
                className={`text-sm font-medium ${
                  overallStatus === "good"
                    ? "text-emerald-400"
                    : overallStatus === "critical"
                      ? "text-red-400"
                      : "text-amber-400"
                }`}
              >
                {overallStatus === "good"
                  ? "All Systems Normal"
                  : overallStatus === "critical"
                    ? "Critical Alert"
                    : "Warning"}
              </span>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {analytics.map((item, index) => {
              if (!item) return null

              return (
                <motion.div
                  key={item.sensor}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    item.status === "critical"
                      ? "bg-red-500/10 border-red-500/30"
                      : item.status === "warning"
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-emerald-500/10 border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">{getSensorLabel(item.sensor)}</span>
                    {item.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : item.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <div className="text-lg font-bold text-white">
                      {item.current.toFixed(1)} {getUnit(item.sensor)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Avg: {item.average.toFixed(1)} {getUnit(item.sensor)}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        item.change > 0 ? "text-emerald-400" : item.change < 0 ? "text-red-400" : "text-slate-400"
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {item.change.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
