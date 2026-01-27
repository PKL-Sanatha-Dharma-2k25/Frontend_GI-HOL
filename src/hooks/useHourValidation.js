import { useState, useCallback } from 'react'
import { getHourlyOutputHeader } from '@/services/apiService'

export function useHourValidation() {
  const [usedHours, setUsedHours] = useState({})
  const [loadingValidation, setLoadingValidation] = useState(false)

  const loadUsedHours = useCallback(async () => {
    setLoadingValidation(true)
    try {
      const response = await getHourlyOutputHeader()
      const allOutputs = response.data || response || []

      const hoursByDate = {}
      allOutputs.forEach(output => {
        if (output.date) {
          if (!hoursByDate[output.date]) {
            hoursByDate[output.date] = []
          }
          if (!hoursByDate[output.date].includes(output.hour)) {
            hoursByDate[output.date].push(output.hour)
          }
        }
      })

      setUsedHours(hoursByDate)
    } catch (error) {
      console.error('Error loading validation data:', error)
    } finally {
      setLoadingValidation(false)
    }
  }, [])

  const isHourUsed = useCallback((date, hour) => {
    if (!date || hour === '' || hour === null) return false

    const hoursForDate = usedHours[date] || []
    const hourNum = parseInt(hour)

    return hoursForDate.includes(hourNum)
  }, [usedHours])

  const getAvailableHours = useCallback((date) => {
    const HOURS = Array.from({ length: 14 }, (_, i) => i + 1) // 1-14 hours
    const usedHoursForDate = usedHours[date] || []
    return HOURS.filter(h => !usedHoursForDate.includes(h))
  }, [usedHours])

  const refreshValidation = useCallback(async () => {
    await loadUsedHours()
  }, [loadUsedHours])

  return {
    usedHours,
    loadingValidation,
    loadUsedHours,
    isHourUsed,
    getAvailableHours,
    refreshValidation
  }
}