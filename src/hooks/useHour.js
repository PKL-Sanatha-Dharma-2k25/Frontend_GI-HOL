import { useState, useEffect } from 'react'
import { getHour } from '@/services/apiService'

export function useHour() {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  useEffect(() => {
    loadHours()
  }, [])

  const loadHours = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getHour()

      if (!response) {
        throw new Error('Empty response from API')
      }

      if (response.data && Array.isArray(response.data)) {
        setHours(response.data)
        setLastFetch(new Date())
        setError(null)
      } else if (Array.isArray(response)) {
        setHours(response)
        setLastFetch(new Date())
        setError(null)
      } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(response)}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to load hour data')
      setHours([])
    } finally {
      setLoading(false)
    }
  }

  const getHourName = (idHour) => {
    if (!idHour && idHour !== 0) return '-'
    const hour = hours.find(h => h.id_hour === parseInt(idHour))
    return hour ? hour.name : '-'
  }

  const getHourDetail = (idHour) => {
    if (!idHour && idHour !== 0) return null
    return hours.find(h => h.id_hour === parseInt(idHour)) || null
  }

  const getHourStartTime = (idHour) => {
    const hour = getHourDetail(idHour)
    return hour ? hour.start_time : '-'
  }

  const getHourEndTime = (idHour) => {
    const hour = getHourDetail(idHour)
    return hour ? hour.end_time : '-'
  }

  const getHourTimeRange = (idHour) => {
    const hour = getHourDetail(idHour)
    if (!hour) return '-'
    return `${hour.start_time} - ${hour.end_time}`
  }

  const getHourOptions = () => {
    if (!Array.isArray(hours)) return []

    return hours.map(h => ({
      value: h.id_hour,
      label: `${h.name} (${h.start_time} - ${h.end_time})`
    }))
  }

  const getHourOptionsCustom = () => {
    return hours.map(h => ({
      value: h.id_hour,
      label: h.name,
      startTime: h.start_time,
      endTime: h.end_time,
      timeRange: `${h.start_time} - ${h.end_time}`
    }))
  }

  const formatHourInfo = (idHour) => {
    const hour = getHourDetail(idHour)
    if (!hour) return '-'
    return `${hour.name} (${hour.start_time} - ${hour.end_time})`
  }

  const formatHourList = (hourIds) => {
    if (!Array.isArray(hourIds)) return []
    return hourIds.map(id => getHourName(id)).filter(name => name !== '-')
  }

  const formatHourListDetailed = (hourIds) => {
    if (!Array.isArray(hourIds)) return []
    return hourIds.map(id => formatHourInfo(id)).filter(info => info !== '-')
  }

  const formatHourListString = (hourIds, separator = ', ') => {
    return formatHourList(hourIds).join(separator)
  }

  const filterHoursByTime = (time) => {
    if (!time) return []

    return hours.filter(h => {
      const start = h.start_time
      const end = h.end_time
      return time >= start && time <= end
    })
  }

  const getHourIdByTime = (time) => {
    const matching = filterHoursByTime(time)
    return matching.length > 0 ? matching[0].id_hour : null
  }

  const getHoursByTimeRange = (startTime, endTime) => {
    return hours.filter(h => {
      return h.start_time >= startTime && h.end_time <= endTime
    })
  }

  const isHourExists = (idHour) => {
    return hours.some(h => h.id_hour === parseInt(idHour))
  }

  const areHoursExist = (hourIds) => {
    if (!Array.isArray(hourIds)) return false
    return hourIds.every(id => isHourExists(id))
  }

  const isTimeValid = (time) => {
    return filterHoursByTime(time).length > 0
  }

  const isTimeRangeValid = (startTime, endTime) => {
    return isTimeValid(startTime) && isTimeValid(endTime)
  }

  const getHourCount = () => {
    return hours.length
  }

  const isDataReady = () => {
    return !loading && hours.length > 0 && !error
  }

  const getAllHours = () => {
    return [...hours]
  }

  const searchHours = (query) => {
    if (!query || query.trim() === '') return hours

    const q = query.toLowerCase()
    return hours.filter(h => {
      return h.name.toLowerCase().includes(q) ||
        h.start_time.includes(q) ||
        h.end_time.includes(q)
    })
  }

  const getMetadata = () => {
    return {
      totalHours: hours.length,
      firstHourId: hours.length > 0 ? hours[0].id_hour : null,
      lastHourId: hours.length > 0 ? hours[hours.length - 1].id_hour : null,
      earliestTime: hours.length > 0 ? hours[0].start_time : null,
      latestTime: hours.length > 0 ? hours[hours.length - 1].end_time : null,
      lastFetched: lastFetch,
      cacheAge: lastFetch ? Math.floor((Date.now() - lastFetch) / 1000) : null
    }
  }

  const reset = () => {
    setHours([])
    setLoading(false)
    setError(null)
    setLastFetch(null)
  }

  return {
    hours,
    loading,
    error,
    lastFetch,
    loadHours,
    getHourName,
    getHourDetail,
    getHourStartTime,
    getHourEndTime,
    getHourTimeRange,
    getHourOptions,
    getHourOptionsCustom,
    formatHourInfo,
    formatHourList,
    formatHourListDetailed,
    formatHourListString,
    filterHoursByTime,
    getHourIdByTime,
    getHoursByTimeRange,
    isHourExists,
    areHoursExist,
    isTimeValid,
    isTimeRangeValid,
    getHourCount,
    isDataReady,
    getAllHours,
    searchHours,
    getMetadata,
    reset
  }
}