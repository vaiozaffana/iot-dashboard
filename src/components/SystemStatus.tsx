"use client"

import { motion } from "framer-motion"
import { Wifi, WifiOff, Clock } from "lucide-react"

interface SystemStatusProps {
  isOnline: boolean
  lastUpdate: Date
}

export function SystemStatus({ isOnline, lastUpdate }: SystemStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: isOnline ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isOnline ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {isOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
        </motion.div>
        <span className={`text-sm font-medium ${isOnline ? "text-emerald-400" : "text-red-400"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs">{lastUpdate.toLocaleTimeString()}</span>
      </div>
    </motion.div>
  )
}
