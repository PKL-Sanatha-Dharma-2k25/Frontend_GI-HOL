import { useState, useEffect } from 'react'
import { getBarChartDash } from '@/services/apiService'

export function useDashboardData(userId) {
  const [selectedHour, setSelectedHour] = useState('1')  
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
          console.log('📊 Fetching all hours data (PARALLEL)...')
          
          // ✅ PARALEL: Fetch semua jam sekaligus dengan Promise.all()
          const promises = Array.from({ length: 10 }, (_, i) => 
            getBarChartDash(userId, (i + 1).toString())
              .then(response => ({
                hour: i + 1,
                data: response?.data && Array.isArray(response.data) ? response.data : []
              }))
              .catch(error => {
                console.warn(`⚠️ Error fetching hour ${i + 1}:`, error)
                return { hour: i + 1, data: [] }
              })
          )

          const results = await Promise.all(promises)
          
          const allData = {}
          results.forEach(({ hour, data }) => {
            allData[hour] = data
          })
          
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
            
            setProcessChartData(response.data)
            
            const orc = response.orc || response.data[0]?.orc || '-'
            const style = response.style || response.data[0]?.style || '-'
            
            setOrcData(orc)
            setStyleData(style)
          } else {
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