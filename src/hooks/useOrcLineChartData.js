import { useState, useEffect } from 'react'
import { getOrcProcessAllReports } from '@/services/apiService'

function transformLineChartData(rawData) {
  /**
   * Input: Array dari API
   * [
   *   { orc: "INQ-26A030L-1", operation_code: "1A", operation_name: "...", output: "1748", target: "1500" },
   *   { orc: "INQ-26A030L-1", operation_code: "1B", operation_name: "...", output: "1245", target: "1300" },
   *   ...
   * ]
   * 
   * Output: Array yang siap untuk Recharts LineChart dengan 2 lines (output & target)
   * [
   *   { 
   *     operation_code: "1A", 
   *     operation_name: "...", 
   *     output: 1748,
   *     target: 1500,
   *     efficiency: 116.5,
   *     status: "exceeding"
   *   },
   *   ...
   * ]
   */
  
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return []
  }

  return rawData
    .map(item => {
      const output = parseInt(item.output) || 0
      const target = parseInt(item.target) || 0
      const efficiency = target > 0 ? ((output / target) * 100).toFixed(1) : 0
      
      // Determine status
      let status = 'normal'
      if (efficiency >= 100) status = 'exceeding'
      else if (efficiency < 80) status = 'critical'
      
      return {
        operation_code: item.operation_code || 'Unknown',
        operation_name: item.operation_name || item.operation_code || 'Unknown',
        output: output,
        target: target,
        efficiency: parseFloat(efficiency),
        status: status,
        orc: item.orc
      }
    })
    .sort((a, b) => {
      // Sort by operation_code (alphanumeric)
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

    const fetchLineChartData = async () => {
      setLineChartLoading(true)
      setError(null)
      try {
        const response = await getOrcProcessAllReports(orc)
        
        if (response?.success && response?.data) {
          // Transform data dari API untuk line chart
          const transformedData = transformLineChartData(response.data)
          console.log('✅ Line chart data transformed:', transformedData)
          setChartData(transformedData)
        } else {
          setChartData([])
          setError('No data available')
        }
      } catch (err) {
        console.error('❌ Error fetching line chart data:', err)
        setError(err.message)
        setChartData([])
      } finally {
        setLineChartLoading(false)
      }
    }

    fetchLineChartData()
  }, [orc])

  return {
    chartData,
    lineChartLoading,
    error
  }
}