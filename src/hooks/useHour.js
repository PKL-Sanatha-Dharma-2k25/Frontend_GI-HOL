import { useState, useEffect } from 'react'
import { getHour } from '@/services/apiService'

/**
 * ⭐ Custom Hook: useHour
 * 
 * Manage master hour data from backend endpoint /auth/gethour
 * Provides utilities untuk format, filter, dan access hour data
 * 
 * @returns {Object} Hour hook object dengan methods & state
 */
export function useHour() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  // ========================================
  // LIFECYCLE - Load data on mount
  // ========================================
  useEffect(() => {
    console.log('⏰ [useHour] Hook mounted, loading hour data...')
    loadHours()
  }, [])

  // ========================================
  // MAIN FUNCTIONS
  // ========================================

  /**
   * Load/Reload hour data from API
   * Automatically called on mount
   * Can be manually called to refresh
   */
  const loadHours = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('⏰ [useHour] Fetching hour master data from API...')
      
      const response = await getHour()
      
      // Validate response structure
      if (!response) {
        throw new Error('Empty response from API')
      }

      // Handle response data
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ [useHour] Hour data successfully loaded:', response.data)
        console.log(`📊 [useHour] Total hours: ${response.data.length}`)
        
        // Log sample data
        if (response.data.length > 0) {
          console.log('📋 [useHour] Sample hour data:', response.data[0])
        }
        
        setHours(response.data)
        setLastFetch(new Date())
        setError(null)
      } else if (Array.isArray(response)) {
        // Handle case where response is directly an array
        console.log('✅ [useHour] Hour data loaded (direct array):', response)
        setHours(response)
        setLastFetch(new Date())
        setError(null)
      } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(response)}`)
      }
    } catch (err) {
      console.error('❌ [useHour] Error loading hours:', err)
      console.error('❌ [useHour] Error message:', err.message)
      setError(err.message || 'Failed to load hour data')
      setHours([])
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // GETTER FUNCTIONS
  // ========================================

  /**
   * Get hour name by ID
   * @param {number} idHour - Hour ID from database
   * @returns {string} Hour name (e.g., "H-1")
   * @example
   * getHourName(1) // Returns: "H-1"
   */
  const getHourName = (idHour) => {
    if (!idHour && idHour !== 0) return '-'
    const hour = hours.find(h => h.id_hour === parseInt(idHour))
    return hour ? hour.name : '-'
  }

  /**
   * Get complete hour object by ID
   * @param {number} idHour - Hour ID from database
   * @returns {Object|null} Complete hour object or null
   * @example
   * getHourDetail(1)
   * // Returns: { id_hour: 1, name: "H-1", start_time: "07:30:00", end_time: "08:29:59" }
   */
  const getHourDetail = (idHour) => {
    if (!idHour && idHour !== 0) return null
    return hours.find(h => h.id_hour === parseInt(idHour)) || null
  }

  /**
   * Get hour start time by ID
   * @param {number} idHour - Hour ID
   * @returns {string} Start time (e.g., "07:30:00")
   */
  const getHourStartTime = (idHour) => {
    const hour = getHourDetail(idHour)
    return hour ? hour.start_time : '-'
  }

  /**
   * Get hour end time by ID
   * @param {number} idHour - Hour ID
   * @returns {string} End time (e.g., "08:29:59")
   */
  const getHourEndTime = (idHour) => {
    const hour = getHourDetail(idHour)
    return hour ? hour.end_time : '-'
  }

  /**
   * Get hour time range
   * @param {number} idHour - Hour ID
   * @returns {string} Formatted time range (e.g., "07:30:00 - 08:29:59")
   */
  const getHourTimeRange = (idHour) => {
    const hour = getHourDetail(idHour)
    if (!hour) return '-'
    return `${hour.start_time} - ${hour.end_time}`
  }

  /**
   * Get all hours as options for select dropdown
   * Used in HourlyOutputForm for hour selection
   * @returns {Array} Array of options: [{ value: id_hour, label: formatted_name }, ...]
   * @example
   * getHourOptions()
   * // Returns:
   * [
   *   { value: 1, label: "H-1 (07:30:00 - 08:29:59)" },
   *   { value: 2, label: "H-2 (08:30:00 - 09:29:59)" },
   *   ...
   * ]
   */
  const getHourOptions = () => {
    if (!Array.isArray(hours)) {
      console.warn('⚠️ [useHour] Hours is not an array:', hours)
      return []
    }
    
    return hours.map(h => ({
      value: h.id_hour,
      label: `${h.name} (${h.start_time} - ${h.end_time})`
    }))
  }

  /**
   * Get hour options with additional custom formatting
   * @param {boolean} includeIdOnly - If true, only include id_hour in label
   * @returns {Array} Array of options
   * @example
   * getHourOptionsCustom()
   * // Returns:
   * [
   *   { value: 1, label: "H-1", startTime: "07:30:00", endTime: "08:29:59" },
   *   ...
   * ]
   */
  const getHourOptionsCustom = () => {
    return hours.map(h => ({
      value: h.id_hour,
      label: h.name,
      startTime: h.start_time,
      endTime: h.end_time,
      timeRange: `${h.start_time} - ${h.end_time}`
    }))
  }

  // ========================================
  // FORMAT FUNCTIONS
  // ========================================

  /**
   * Format hour info for display
   * @param {number} idHour - Hour ID
   * @returns {string} Formatted string: "H-1 (07:30:00 - 08:29:59)"
   * @example
   * formatHourInfo(1) // Returns: "H-1 (07:30:00 - 08:29:59)"
   */
  const formatHourInfo = (idHour) => {
    const hour = getHourDetail(idHour)
    if (!hour) return '-'
    return `${hour.name} (${hour.start_time} - ${hour.end_time})`
  }

  /**
   * Format hours array for display (e.g., in badges)
   * @param {Array<number>} hourIds - Array of hour IDs
   * @returns {Array<string>} Array of formatted names
   * @example
   * formatHourList([1, 2, 3])
   * // Returns: ["H-1", "H-2", "H-3"]
   */
  const formatHourList = (hourIds) => {
    if (!Array.isArray(hourIds)) return []
    return hourIds.map(id => getHourName(id)).filter(name => name !== '-')
  }

  /**
   * Format hours array with full info
   * @param {Array<number>} hourIds - Array of hour IDs
   * @returns {Array<string>} Array of full formatted info
   * @example
   * formatHourListDetailed([1, 2])
   * // Returns: ["H-1 (07:30:00 - 08:29:59)", "H-2 (08:30:00 - 09:29:59)"]
   */
  const formatHourListDetailed = (hourIds) => {
    if (!Array.isArray(hourIds)) return []
    return hourIds.map(id => formatHourInfo(id)).filter(info => info !== '-')
  }

  /**
   * Convert hour list to readable string
   * @param {Array<number>} hourIds - Array of hour IDs
   * @param {string} separator - Separator between hours (default: ", ")
   * @returns {string} Comma-separated hour names
   * @example
   * formatHourListString([1, 2, 3])
   * // Returns: "H-1, H-2, H-3"
   */
  const formatHourListString = (hourIds, separator = ', ') => {
    return formatHourList(hourIds).join(separator)
  }

  // ========================================
  // FILTER FUNCTIONS
  // ========================================

  /**
   * Filter hours by specific time range
   * Returns hours that overlap with given time
   * @param {string} time - Time in HH:MM:SS format
   * @returns {Array} Matching hours
   * @example
   * filterHoursByTime("08:00:00")
   * // Returns hours that contain 08:00:00
   */
  const filterHoursByTime = (time) => {
    if (!time) return []
    
    return hours.filter(h => {
      const start = h.start_time
      const end = h.end_time
      return time >= start && time <= end
    })
  }

  /**
   * Get hour ID by time
   * Returns first hour that contains the given time
   * @param {string} time - Time in HH:MM:SS format
   * @returns {number|null} Hour ID or null if not found
   * @example
   * getHourIdByTime("08:00:00") // Returns: 1
   */
  const getHourIdByTime = (time) => {
    const matching = filterHoursByTime(time)
    return matching.length > 0 ? matching[0].id_hour : null
  }

  /**
   * Get all hours in a specific range
   * @param {string} startTime - Start time in HH:MM:SS
   * @param {string} endTime - End time in HH:MM:SS
   * @returns {Array} Hours that fall within range
   */
  const getHoursByTimeRange = (startTime, endTime) => {
    return hours.filter(h => {
      return h.start_time >= startTime && h.end_time <= endTime
    })
  }

  // ========================================
  // VALIDATION FUNCTIONS
  // ========================================

  /**
   * Check if hour ID exists
   * @param {number} idHour - Hour ID to check
   * @returns {boolean} True if hour exists
   * @example
   * isHourExists(1) // Returns: true
   */
  const isHourExists = (idHour) => {
    return hours.some(h => h.id_hour === parseInt(idHour))
  }

  /**
   * Check if multiple hours exist
   * @param {Array<number>} hourIds - Array of hour IDs
   * @returns {boolean} True if all hours exist
   */
  const areHoursExist = (hourIds) => {
    if (!Array.isArray(hourIds)) return false
    return hourIds.every(id => isHourExists(id))
  }

  /**
   * Validate if time falls within any hour
   * @param {string} time - Time in HH:MM:SS format
   * @returns {boolean} True if time is within any hour
   */
  const isTimeValid = (time) => {
    return filterHoursByTime(time).length > 0
  }

  /**
   * Validate if time range is valid
   * @param {string} startTime - Start time HH:MM:SS
   * @param {string} endTime - End time HH:MM:SS
   * @returns {boolean} True if both times are valid
   */
  const isTimeRangeValid = (startTime, endTime) => {
    return isTimeValid(startTime) && isTimeValid(endTime)
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Get hour count
   * @returns {number} Total number of hours
   */
  const getHourCount = () => {
    return hours.length
  }

  /**
   * Check if data is loaded and valid
   * @returns {boolean} True if hours data is available
   */
  const isDataReady = () => {
    return !loading && hours.length > 0 && !error
  }

  /**
   * Get all hours with metadata
   * @returns {Array} Raw hours array
   */
  const getAllHours = () => {
    return [...hours]
  }

  /**
   * Search hours by name or time
   * @param {string} query - Search query
   * @returns {Array} Matching hours
   * @example
   * searchHours("H-1") // Returns: [{ id_hour: 1, name: "H-1", ... }]
   * searchHours("07:30") // Returns: [{ id_hour: 1, name: "H-1", ... }]
   */
  const searchHours = (query) => {
    if (!query || query.trim() === '') return hours
    
    const q = query.toLowerCase()
    return hours.filter(h => {
      return h.name.toLowerCase().includes(q) ||
             h.start_time.includes(q) ||
             h.end_time.includes(q)
    })
  }

  /**
   * Get metadata about hours
   * @returns {Object} Metadata
   */
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

  /**
   * Reset all data and errors
   * Useful for cleanup or testing
   */
  const reset = () => {
    console.log('🔄 [useHour] Resetting hook state...')
    setHours([])
    setLoading(false)
    setError(null)
    setLastFetch(null)
  }

  // ========================================
  // RETURN OBJECT
  // ========================================
  return {
    // State
    hours,
    loading,
    error,
    lastFetch,

    // Main Functions
    loadHours,

    // Getters
    getHourName,
    getHourDetail,
    getHourStartTime,
    getHourEndTime,
    getHourTimeRange,
    getHourOptions,
    getHourOptionsCustom,

    // Format Functions
    formatHourInfo,
    formatHourList,
    formatHourListDetailed,
    formatHourListString,

    // Filter Functions
    filterHoursByTime,
    getHourIdByTime,
    getHoursByTimeRange,

    // Validation
    isHourExists,
    areHoursExist,
    isTimeValid,
    isTimeRangeValid,

    // Utilities
    getHourCount,
    isDataReady,
    getAllHours,
    searchHours,
    getMetadata,
    reset
  }
}