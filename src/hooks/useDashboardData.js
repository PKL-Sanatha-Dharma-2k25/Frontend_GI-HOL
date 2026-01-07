// ============================================
// FILE 1: /hooks/useDashboardData.js
// ============================================
import { useState, useEffect } from 'react'
import { getBarChartDash } from '@/services/apiService'

export function useDashboardData(userId) {
  const [selectedHour, setSelectedHour] = useState('3')
  const [viewAllHours, setViewAllHours] = useState(false)
  const [processChartData, setProcessChartData] = useState([])
  const [allHoursData, setAllHoursData] = useState({})
  const [chartLoading, setChartLoading] = useState(false)

  useEffect(() => {
    if (!userId) {
      console.warn('⚠️ User ID tidak tersedia')
      return
    }

    const fetchChartData = async () => {
      setChartLoading(true)
      try {
        if (viewAllHours) {
          console.log('📊 Fetching all hours data...')
          const allData = {}
          
          for (let hour = 1; hour <= 10; hour++) {
            try {
              const response = await getBarChartDash(userId, hour.toString())
              if (response?.data && Array.isArray(response.data)) {
                allData[hour] = response.data
              } else {
                allData[hour] = []
              }
            } catch (error) {
              console.warn(`⚠️ Error fetching hour ${hour}:`, error)
              allData[hour] = []
            }
          }
          
          console.log('✅ All hours data loaded:', allData)
          setAllHoursData(allData)
          setProcessChartData([])
        } else {
          console.log('📊 Fetching chart data...', { userId, selectedHour })
          const response = await getBarChartDash(userId, selectedHour)
          
          if (response?.data && Array.isArray(response.data)) {
            console.log('✅ Chart data loaded:', response.data)
            setProcessChartData(response.data)
          } else {
            console.warn('⚠️ Data format tidak sesuai')
            setProcessChartData([])
          }
        }
      } catch (error) {
        console.error('❌ Error fetching chart data:', error)
        setProcessChartData([])
        setAllHoursData({})
      } finally {
        setChartLoading(false)
      }
    }

    fetchChartData()
  }, [userId, selectedHour, viewAllHours])

  return {
    selectedHour,
    setSelectedHour,
    viewAllHours,
    setViewAllHours,
    processChartData,
    allHoursData,
    chartLoading
  }
}

