"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from "lucide-react"
import type { SensorType } from "@/types/sensor"

interface DetailedChartProps {
  type: SensorType
  title: string
  unit: string
}

export function DetailedChart({ type, title, unit }: DetailedChartProps) {
  const [chartType, setChartType] = useState<"line" | "area">("area")
  const [isExpanded, setIsExpanded] = useState(false)
  const [data, setData] = useState<{ time: string; value: number }[]>([])

  // --- Ambil data dari Flask API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://10.13.79.42:5000/api/sensor")
        const json = await res.json()

        let value = 0
        switch (type) {
          case "temperature":
            value = json.suhu
            break
          case "humidity":
            value = json.kelembaban
            break
          case "co":
            value = json.gas?.CO || 0
            break
          case "co2":
            value = json.gas?.CO2 || 0
            break
          case "nh4":
            value = json.gas?.NH4 || 0
            break
          case "light":
            value = json.ldr
            break
        }

        if (value !== undefined && value !== null) {
          const now = new Date()
          const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })

          setData((prev) => [...prev.slice(-19), { time, value }]) // max 20 data
        }
      } catch (err) {
        console.error("❌ Fetch error:", err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // update tiap 5s
    return () => clearInterval(interval)
  }, [type])

  const currentValue = data[data.length - 1]?.value || 0
  const previousValue = data[data.length - 2]?.value || 0
  const trend = currentValue > previousValue ? "up" : currentValue < previousValue ? "down" : "stable"

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{`Time: ${label}`}</p>
          <p className="text-white text-lg font-bold">{`${payload[0].value} ${unit}`}</p>
        </div>
      )
    }
    return null
  }

  const TrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <div className="flex items-center gap-1">
                <TrendIcon />
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  {trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType(chartType === "line" ? "area" : "line")}
                className="text-slate-400 hover:text-white"
              >
                {chartType === "line" ? <Activity className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white"
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>

          <motion.div
            animate={{ height: isExpanded ? 400 : 200 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            style={{ height: isExpanded ? 400 : 200 }}
          >
            <ResponsiveContainer width="100%" height={isExpanded ? 400 : 200}>
              {chartType === "area" ? (
                <AreaChart data={data} key="area">
                  <defs>
                    <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getStrokeColor(type)} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={getStrokeColor(type)} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.5)" fontSize={12} />
                  <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={getStrokeColor(type)}
                    strokeWidth={2}
                    fill={`url(#gradient-${type})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: getStrokeColor(type),
                      stroke: "rgba(255,255,255,0.8)",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={data} key="line">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.5)" fontSize={12} />
                  <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getStrokeColor(type)}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: getStrokeColor(type),
                      stroke: "rgba(255,255,255,0.8)",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
