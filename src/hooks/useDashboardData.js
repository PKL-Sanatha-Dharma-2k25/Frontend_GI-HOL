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

  // Stats data (all-time)
  const [statsData, setStatsData] = useState({
    totalOutput: 0,
    totalTarget: 0,
    totalRepair: 0,
    totalReject: 0,
    efficiency: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)

  // Fetch stats data (all-time)
  useEffect(() => {
    if (!userId) {
      console.warn('User ID tidak tersedia')
      return
    }

    const fetchStatsData = async () => {
      setStatsLoading(true)
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
        } else {
          setStatsData({
            totalOutput: 0,
            totalTarget: 0,
            totalRepair: 0,
            totalReject: 0,
            efficiency: 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats data:', error)
        setStatsData({
          totalOutput: 0,
          totalTarget: 0,
          totalRepair: 0,
          totalReject: 0,
          efficiency: 0
        })
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStatsData()
  }, [userId])

  // Fetch chart data
  useEffect(() => {
    if (!userId) {
      console.warn('User ID tidak tersedia')
      return
    }

    const fetchChartData = async () => {
      setChartLoading(true)
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
    styleData,
    statsData,
    statsLoading
  }
}