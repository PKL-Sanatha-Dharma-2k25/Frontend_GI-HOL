import { useState, useEffect } from 'react'
import { getBarChartDash } from '@/services/apiService'

export function useDashboardData(userId) {
  const [selectedHour, setSelectedHour] = useState('3')
  const [viewAllHours, setViewAllHours] = useState(false)
  const [processChartData, setProcessChartData] = useState([])
  const [allHoursData, setAllHoursData] = useState({})
  const [chartLoading, setChartLoading] = useState(false)
  const [orcData, setOrcData] = useState('-')
  const [styleData, setStyleData] = useState('-')

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
          setOrcData('-')
          setStyleData('-')
        } else {
          console.log('📊 Fetching chart data...', { userId, selectedHour })
          const response = await getBarChartDash(userId, selectedHour)
          
          if (response?.data && Array.isArray(response.data)) {
            console.log('✅ Chart data loaded:', response.data)
            console.log('📋 First item:', response.data[0])
            
            setProcessChartData(response.data)
            
            // ✅ Extract ORC & Style dari response (bukan dari data array)
            const orc = response.orc || response.data[0]?.orc || '-'
            const style = response.style || response.data[0]?.style || '-'
            
            console.log('🎯 ORC:', orc)
            console.log('🎨 Style:', style)
            
            setOrcData(orc)
            setStyleData(style)
          } else {
            console.warn('⚠️ Data format tidak sesuai')
            setProcessChartData([])
            setOrcData('-')
            setStyleData('-')
          }
        }
      } catch (error) {
        console.error('❌ Error fetching chart data:', error)
        setProcessChartData([])
        setAllHoursData({})
        setOrcData('-')
        setStyleData('-')
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
    chartLoading,
    orcData,
    styleData
  }
}