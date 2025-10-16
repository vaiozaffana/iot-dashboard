"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { InteractiveSensorCard } from "@/components/InteractiveSensorCard"
import { DetailedChart } from "@/components/DetailedChart"
import { AnalyticsOverview } from "@/components/AnalyticsOverview"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { SystemStatus } from "@/components/SystemStatus"
import { LightControl } from "@/components/LightControl"

interface ApiResponse {
  fan_mode: string
  gas: {
    Aceton: number
    Alcohol: number
    CO: number
    CO2: number
    NH4: number
    Tolueno: number
  }
  kelembaban: number
  ldr: number
  suhu: number
}

interface SensorData {
  temperature: number
  humidity: number
  co: number
  co2: number
  nh4: number
  light: number
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    co: 0,
    co2: 0,
    nh4: 0,
    light: 0,
  })

  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://10.13.79.42:5000/api/sensor')
      const data: ApiResponse = await response.json()
      
      setSensorData({
        temperature: data.suhu,
        humidity: data.kelembaban,
        co: data.gas.CO,
        co2: data.gas.CO2,
        nh4: data.gas.NH4,
        light: data.ldr,
      })
      
      setLastUpdate(new Date())
      setIsOnline(true)
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      setIsOnline(false)
    }
  }

  useEffect(() => {
    setIsLoaded(true)
    
    fetchSensorData()

    const interval = setInterval(fetchSensorData, 3000)

    return () => clearInterval(interval)
  }, [])


  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <h2 className="text-xl font-semibold text-white mb-2">Initializing Smart Home Monitor</h2>
          <p className="text-slate-400">Connecting to sensors...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Smart Home Monitor
              </h1>
              <p className="text-slate-400 text-lg">Real-time environmental monitoring dashboard</p>
            </motion.div>
            <SystemStatus isOnline={isOnline} lastUpdate={lastUpdate} />
          </div>
        </motion.div>

        <LightControl />

        {/* Analytics Overview */}
        <AnalyticsOverview currentData={sensorData} />

        {/* Sensor Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <InteractiveSensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            type="temperature"
            range={{ min: 18, max: 32 }}
            delay={0}
          />
          <InteractiveSensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            type="humidity"
            range={{ min: 20, max: 90 }}
            delay={0.1}
          />
          <InteractiveSensorCard
            title="Carbon Monoxide"
            value={sensorData.co}
            unit="ppm"
            type="co"
            range={{ min: 0, max: 50 }}
            delay={0.2}
          />
          <InteractiveSensorCard
            title="Carbon Dioxide"
            value={sensorData.co2}
            unit="ppm"
            type="co2"
            range={{ min: 400, max: 2000 }}
            delay={0.3}
          />
          <InteractiveSensorCard
            title="Ammonia"
            value={sensorData.nh4}
            unit="ppm"
            type="nh4"
            range={{ min: 0, max: 100 }}
            delay={0.4}
          />
          <InteractiveSensorCard
            title="Light Sensor"
            value={sensorData.light}
            unit="lux"
            type="light"
            range={{ min: 0, max: 1000 }}
            delay={0.5}
          />
        </motion.div>

        {/* Detailed Charts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <DetailedChart type="temperature" title="Temperature Trends" unit="°C" />
          <DetailedChart type="humidity" title="Humidity Levels" unit="%" />
          <DetailedChart type="co2" title="CO₂ Concentration" unit="ppm" />
          <DetailedChart type="light" title="Light Intensity" unit="lux" />
        </motion.div>
      </div>

      {/*    */}
    </div>
  )
}
