"use client"

import { useMemo } from "react"
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts"
import { getSensorHistory } from "@/lib/sensorData"
import type { SensorType, SensorRange } from "@/types/sensor"

interface MiniChartProps {
  type: SensorType
  currentValue: number
  range: SensorRange
}

export function MiniChart({ type, currentValue, range }: MiniChartProps) {
  const data = useMemo(() => {
    const history = getSensorHistory(type)

    if (history.length === 0) {
      const sampleData = []
      let value = currentValue

      for (let i = 0; i < 15; i++) {
        const variation = (Math.random() - 0.5) * (range.max - range.min) * 0.05
        value = Math.max(range.min, Math.min(range.max, value + variation))
        sampleData.push({
          time: new Date(Date.now() - (15 - i) * 3000).toLocaleTimeString(),
          value: Math.round(value * 10) / 10,
        })
      }
      return sampleData
    }

    return history.slice(-15)
  }, [type, currentValue, range])

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
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-2 shadow-lg">
          <p className="text-slate-300 text-xs">{`Time: ${label}`}</p>
          <p className="text-white text-sm font-semibold">{`Value: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={[range.min, range.max]} hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getStrokeColor(type)}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 3,
              fill: getStrokeColor(type),
              stroke: "rgba(255,255,255,0.8)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
