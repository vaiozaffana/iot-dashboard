export interface SensorData {
  temperature: number
  humidity: number
  co: number
  co2: number
  nh4: number
  light: number
}

export interface SensorRange {
  min: number
  max: number
}

export type SensorType = "temperature" | "humidity" | "co" | "co2" | "nh4" | "light"
