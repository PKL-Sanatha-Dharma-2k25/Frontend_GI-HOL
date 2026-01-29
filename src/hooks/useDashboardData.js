import { useState, useEffect } from 'react'
import { getBarChartDash, getOutputAllDash } from '@/services/apiService'

export function useDashboardData(userId) {
  const [selectedHour, setSelectedHour] = useState('1')
  const [viewAllHours, setViewAllHours] = useState(false)
  const [processChartData, setProcessChartData] = useState([])
  const [allHoursData, setAllHoursData] = useState({})
  const [chartLoading, setChartLoading] = useState(false)
  const [orcData, setOrcData] = useState('-')
  const [styleData, setStyleData] = useState('-')

  const [statsData, setStatsData] = useState({
    totalOutput: 0,
    totalTarget: 0,
    totalRepair: 0,
    totalReject: 0,
    efficiency: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)


  useEffect(() => {
    if (!userId) return

    const fetchChartData = async (isAutoRefresh = false) => {
      if (!isAutoRefresh) setChartLoading(true)
      try {
        if (viewAllHours) {
          const promises = Array.from({ length: 10 }, (_, i) =>
            getBarChartDash(userId, (i + 1).toString())
              .then(response => ({
                hour: i + 1,
                data: response?.data && Array.isArray(response.data) ? response.data : []
              }))
              .catch(error => {
                console.warn(`Error fetching hour ${i + 1}:`, error)
                return { hour: i + 1, data: [] }
              })
          )

          const results = await Promise.all(promises)

          const allData = {}
          results.forEach(({ hour, data }) => {
            allData[hour] = data
          })

          setAllHoursData(allData)
          setProcessChartData([])
          setOrcData('-')
          setStyleData('-')
        } else {
          const response = await getBarChartDash(userId, selectedHour)

          if (response?.data && Array.isArray(response.data)) {
            const totalRepair = response.data.reduce((sum, item) => sum + (parseInt(item.repair) || 0), 0)
            const totalReject = response.data.reduce((sum, item) => sum + (parseInt(item.reject) || 0), 0)

            setProcessChartData(response.data)

            const orc = response.orc || response.data[0]?.orc || '-'
            const style = response.style || response.data[0]?.style || '-'

            setOrcData(orc)
            setStyleData(style)

            setStatsData(prev => ({
              ...prev,
              totalRepair,
              totalReject
            }))
          } else {
            setProcessChartData([])
            setOrcData('-')
            setStyleData('-')
            setStatsData(prev => ({
              ...prev,
              totalRepair: 0,
              totalReject: 0
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
        if (!isAutoRefresh) {
          setProcessChartData([])
          setAllHoursData({})
          setOrcData('-')
          setStyleData('-')
        }
      } finally {
        if (!isAutoRefresh) setChartLoading(false)
      }
    }

    const fetchStatsData = async (isAutoRefresh = false) => {
      if (!isAutoRefresh) setStatsLoading(true)
      try {
        const response = await getOutputAllDash(userId)
        if (response?.success) {
          setStatsData({
            totalOutput: response.totalOutput,
            totalTarget: response.totalTarget,
            totalRepair: response.totalRepair || 0,
            totalReject: response.totalReject || 0,
            efficiency: response.efficiency
          })
        }
      } catch (error) {
        console.error('Error fetching stats data:', error)
      } finally {
        if (!isAutoRefresh) setStatsLoading(false)
      }
    }

    fetchChartData()
    fetchStatsData()

    const interval = setInterval(() => {
      fetchChartData(true)
      fetchStatsData(true)
    }, 30000)

    return () => clearInterval(interval)
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
    styleData,
    statsData,
    statsLoading
  }
}