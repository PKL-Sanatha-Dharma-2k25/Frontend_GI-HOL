import { useState, useEffect } from 'react'
import { getOrcProcessAllReports } from '@/services/apiService'

function transformLineChartData(rawData) {

  if (!Array.isArray(rawData) || rawData.length === 0) {
    return []
  }

  return rawData
    .map(item => {
      const output = parseInt(
        item.output ??
        item.total_output ??
        item.jumlah_output ??
        0
      ) || 0

      const target = parseInt(
        item.target ??
        item.total_target ??
        item.target_output ??
        item.target_per_day ??
        item.qty_target ??
        0
      ) || 0

      const efficiency = target > 0 ? ((output / target) * 100).toFixed(1) : 0

      let status = 'normal'
      if (efficiency >= 100) status = 'exceeding'
      else if (efficiency < 80) status = 'critical'

      const repair = parseInt(item.repair || item.qty_repair || 0) || 0
      const reject = parseInt(item.reject || item.qty_reject || 0) || 0

      return {
        operation_code: item.operation_code || 'Unknown',
        operation_name: item.operation_name || item.operation_code || 'Unknown',
        output: output,
        target: target,
        repair: repair,
        reject: reject,
        efficiency: parseFloat(efficiency),
        status: status,
        orc: item.orc
      }
    })
    .sort((a, b) => {

      return a.operation_code.localeCompare(b.operation_code, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })
}

export function useOrcLineChartData(orc) {
  const [chartData, setChartData] = useState([])
  const [lineChartLoading, setLineChartLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orc || orc === '-') {
      console.warn('⚠️ ORC tidak tersedia untuk line chart')
      setChartData([])
      setError(null)
      return
    }

    const fetchLineChartData = async (isAutoRefresh = false) => {
      if (!isAutoRefresh) setLineChartLoading(true)
      setError(null)
      try {
        const response = await getOrcProcessAllReports(orc)

        if (response?.success && response?.data) {
          const transformedData = transformLineChartData(response.data)
          setChartData(transformedData)
        } else {
          if (!isAutoRefresh) setChartData([])
          setError('No data available')
        }
      } catch (err) {
        console.error('❌ Error fetching line chart data:', err)
        if (!isAutoRefresh) {
          setError(err.message)
          setChartData([])
        }
      } finally {
        if (!isAutoRefresh) setLineChartLoading(false)
      }
    }

    fetchLineChartData()

    const interval = setInterval(() => {
      fetchLineChartData(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [orc])

  return {
    chartData,
    lineChartLoading,
    error
  }
}