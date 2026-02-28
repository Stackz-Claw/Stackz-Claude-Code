import { useState, useEffect } from 'react'

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

export function useDayNight() {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay())
  const [hour, setHour] = useState(new Date().getHours())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay())
      setHour(new Date().getHours())
    }, 60000) // check every minute

    return () => clearInterval(interval)
  }, [])

  const lightConfig = {
    dawn: { ambientIntensity: 0.4, sunColor: '#ff9f6b', sunIntensity: 0.8, skyColor: '#1a0a2e' },
    day: { ambientIntensity: 0.7, sunColor: '#fff5e0', sunIntensity: 1.2, skyColor: '#0d1220' },
    dusk: { ambientIntensity: 0.5, sunColor: '#ff6b35', sunIntensity: 0.9, skyColor: '#1a0820' },
    night: { ambientIntensity: 0.2, sunColor: '#3a4a7a', sunIntensity: 0.4, skyColor: '#080b14' },
  }

  return {
    timeOfDay,
    hour,
    ...lightConfig[timeOfDay],
    lightConfig: lightConfig[timeOfDay],
  }
}
