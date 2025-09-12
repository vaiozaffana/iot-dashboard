"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Download, Share2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Settings, label: "Settings", action: () => console.log("Settings") },
    { icon: Download, label: "Export Data", action: () => console.log("Export") },
    { icon: Share2, label: "Share", action: () => console.log("Share") },
    { icon: RefreshCw, label: "Refresh", action: () => window.location.reload() },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={action.action}
                  className="bg-slate-800/90 backdrop-blur-sm border-slate-600 hover:bg-slate-700 text-white shadow-lg"
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Settings className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  )
}
