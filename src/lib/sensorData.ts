import type { SensorData } from "@/types/sensor"

export const sensorHistory: Record<keyof SensorData, number[]> = {
  temperature: [],
  humidity: [],
  co: [],
  co2: [],
  nh4: [],
  light: [],
}

let previousData: SensorData = {
  temperature: 22,
  humidity: 45,
  co: 5,
  co2: 800,
  nh4: 10,
  light: 500,
}

function getTimeBasedMultiplier(): number {
  const hour = new Date().getHours()

  if (hour >= 6 && hour <= 18) {
    return 1.2
  } else {
    return 0.8
  }
}

function getSeasonalMultiplier(): number {
  const month = new Date().getMonth()

  if (month >= 5 && month <= 8) {
    return 1.1
  } else if (month >= 11 || month <= 2) {
    return 0.9
  }

  return 1.0
}

export function generateSensorData(): SensorData {
  const timeMultiplier = getTimeBasedMultiplier()
  const seasonalMultiplier = getSeasonalMultiplier()

  const generateValue = (
    current: number,
    min: number,
    max: number,
    maxChange = 2,
    timeInfluence = false,
    seasonalInfluence = false,
  ) => {
    let change = (Math.random() - 0.5) * maxChange

    if (timeInfluence) {
      change *= timeMultiplier
    }

    if (seasonalInfluence) {
      change *= seasonalMultiplier
    }

    const momentum = Math.random() > 0.7 ? change * 0.3 : 0

    const newValue = current + change + momentum
    return Math.max(min, Math.min(max, newValue))
  }

  const newData: SensorData = {
    temperature: Math.round(generateValue(previousData.temperature, 18, 32, 1, true, true) * 10) / 10,
    humidity: Math.round(generateValue(previousData.humidity, 20, 90, 3, true, true)),
    co: Math.round(generateValue(previousData.co, 0, 50, 2, true) * 10) / 10,
    co2: Math.round(generateValue(previousData.co2, 400, 2000, 50, true)),
    nh4: Math.round(generateValue(previousData.nh4, 0, 100, 5) * 10) / 10,
    light: Math.round(generateValue(previousData.light, 0, 1000, 50, true)),
  }

  Object.keys(newData).forEach((key) => {
    const sensorKey = key as keyof SensorData
    sensorHistory[sensorKey].push(newData[sensorKey])
    if (sensorHistory[sensorKey].length > 50) {
      sensorHistory[sensorKey].shift()
    }
  })

  previousData = newData
  return newData
}

export function getSensorHistory(sensor: keyof SensorData): Array<{ time: string; value: number }> {
  return sensorHistory[sensor].map((value, index) => ({
    time: new Date(Date.now() - (sensorHistory[sensor].length - index - 1) * 3000).toLocaleTimeString(),
    value,
  }))
}

export function initializeSensorHistory(): void {
  for (let i = 0; i < 20; i++) {
    generateSensorData()
  }
}
