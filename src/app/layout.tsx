import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Suspense } from "react"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "Smart Home Monitor - Real-time Environmental Dashboard",
  description:
    "Advanced smart home monitoring dashboard with real-time environmental sensor data, analytics, and interactive visualizations.",
  generator: "v0.app",
  keywords: ["smart home", "monitoring", "sensors", "dashboard", "IoT", "environmental"],
  authors: [{ name: "Smart Home Monitor" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a192f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
