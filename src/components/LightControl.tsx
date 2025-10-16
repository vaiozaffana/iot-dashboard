"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, LightbulbOff } from "lucide-react"

interface LightState {
  id: string
  name: string
  isOn: boolean
  brightness: number
  color: string
}

export function LightControl() {
  const [lights, setLights] = useState<LightState[]>([
    { id: "Lamp 1", name: "Lamp 1", isOn: false, brightness: 80, color: "#ffffff" },
    { id: "Lamp 2", name: "Lamp 2", isOn: false, brightness: 60, color: "#ffffff" },
    { id: "Lamp 3", name: "Lamp 3", isOn: false, brightness: 40, color: "#ffffff" },
    { id: "Lamp 4", name: "Lamp 4", isOn: false, brightness: 90, color: "#ffffff" },
  ])

  // === Fungsi toggle dengan API Flask ===
  const toggleLight = async (id: string) => {
    const lampNumber = id.split(" ")[1] // "Lamp 1" → "1"
    try {
      const res = await fetch(`http://10.13.79.42:5000/toggle/${lampNumber}`, {
        method: "GET",
      })

      if (!res.ok) throw new Error("Gagal toggle lampu")

      // Update state setelah toggle
      setLights((prev) =>
        prev.map((light) =>
          light.id === id ? { ...light, isOn: !light.isOn } : light
        )
      )
    } catch (error) {
      console.error("❌ Error toggle:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/20">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Light Control</h3>
          <p className="text-slate-400 text-sm">Manage your smart lights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {lights.map((light, index) => (
          <motion.div
            key={light.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`
              relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
              ${
                light.isOn
                  ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-lg"
                  : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50"
              }
            `}
            onClick={() => toggleLight(light.id)}
          >
            {light.isOn && (
              <motion.div
                className="absolute inset-0 rounded-xl opacity-20"
                style={{
                  background: `radial-gradient(circle at center, ${light.color}, transparent 70%)`,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                  {light.isOn ? (
                    <Lightbulb
                      className="w-6 h-6 transition-colors duration-300"
                      style={{ color: light.color }}
                    />
                  ) : (
                    <LightbulbOff className="w-6 h-6 text-slate-500" />
                  )}
                </motion.div>

                <motion.div
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${light.isOn ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-slate-600"}
                  `}
                  animate={light.isOn ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>

              <h4
                className={`font-medium mb-2 transition-colors duration-300 ${
                  light.isOn ? "text-white" : "text-slate-400"
                }`}
              >
                {light.name}
              </h4>

              <div className="space-y-2"></div>

              <div className="mt-3 text-xs text-slate-500">{light.isOn ? "ON" : "OFF"}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center mt-6 pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const allOn = lights.every(l => l.isOn)
            lights.forEach(l => toggleLight(l.id))
          }}
          className={`
            flex-1 py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium
            ${lights.every(l => l.isOn) 
              ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 hover:from-red-500/30 hover:to-rose-500/30"
              : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30"
            }
          `}
        >
          {lights.every(l => l.isOn) ? "All Off" : "All On"}
        </motion.button>
      </div>
    </motion.div>
  )
}
