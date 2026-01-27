import { useState, useCallback } from 'react'
import {
  getHourlyOutputHeader,
  getOrcSewing,
  storeHourlyOutput,
  storeDetailOutput
} from '@/services/apiService'
import { getFullJakartaDateTime } from '@/utils/dateTime'



export function useHourValidation() {
  const [usedHours, setUsedHours] = useState({})
  const [loadingValidation, setLoadingValidation] = useState(false)


  const loadUsedHours = useCallback(async () => {
    setLoadingValidation(true)
    try {
      console.log(' [useHourValidation] Loading used hours from backend...')

      // Ambil semua output header dari database
      const response = await getHourlyOutputHeader()
      const allOutputs = response.data || response || []

      console.log(' [useHourValidation] All outputs:', allOutputs)

      // Group by date dan ambil semua jam yang sudah ada
      // Format: { 'YYYY-MM-DD': [1, 2, 3, ...], ... }
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

      console.log(' [useHourValidation] Used hours by date:', hoursByDate)
      setUsedHours(hoursByDate)
    } catch (error) {
      console.error(' [useHourValidation] Error loading used hours:', error)
    } finally {
      setLoadingValidation(false)
    }
  }, [])

  /**
   * Check apakah jam tertentu sudah terpakai di hari tertentu
   * @param {string} date - Format YYYY-MM-DD
   * @param {number|string} hour - Jam (1-10)
   * @returns {boolean} true jika sudah terpakai, false jika masih bisa dipakai
   */
  const isHourUsed = useCallback((date, hour) => {
    if (!date || hour === '' || hour === null) return false

    const hoursForDate = usedHours[date] || []
    const hourNum = parseInt(hour)

    const used = hoursForDate.includes(hourNum)
    console.log(` [isHourUsed] date = ${date}, hour = ${hour}, used = ${used} `)

    return used
  }, [usedHours])

  /**
   * Get list jam yang masih bisa dipakai untuk date tertentu
   * @param {string} date - Format YYYY-MM-DD
   * @returns {number[]} Array jam yang masih available
   */
  const getAvailableHours = useCallback((date) => {
    const HOURS = Array.from({ length: 10 }, (_, i) => i + 1) // [1, 2, 3, ..., 10]
    const usedHoursForDate = usedHours[date] || []
    const available = HOURS.filter(h => !usedHoursForDate.includes(h))

    console.log(` [getAvailableHours] date = ${date}, available hours: `, available)
    return available
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



export function useHourlyOutputV2(user, showAlertMessage, detailHook, hourValidation) {
  const [orcList, setOrcList] = useState([])
  const [filteredOrcList, setFilteredOrcList] = useState([])
  const [outputs, setOutputs] = useState([])
  const [loading, setLoading] = useState(false)

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const orcData = await getOrcSewing()
      setOrcList(orcData.data || orcData || [])
      setFilteredOrcList(orcData.data || orcData || [])

      const outputData = await getHourlyOutputHeader()
      setOutputs(outputData.data || outputData || [])


      await hourValidation.loadUsedHours()

      showAlertMessage('success', 'Data loaded successfully')
    } catch (error) {
      console.error('Error loading data:', error)
      showAlertMessage('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = useCallback(async (formData, selectedOrc) => {
    const errors = []


    if (!formData.date || formData.date.trim() === '') {
      errors.push('* Date is required')
    }


    if (!formData.hour || formData.hour.trim() === '' || formData.hour === '0') {
      errors.push('* Hour is required')
    }


    if (!selectedOrc) {
      errors.push('* ORC is required')
    }

    if (formData.date && formData.hour) {
      const isUsed = hourValidation.isHourUsed(formData.date, formData.hour)
      if (isUsed) {
        errors.push(`* Hour ${formData.hour} already used on ${formData.date} `)
      }
    }

    if (errors.length > 0) {
      showAlertMessage('error', 'Please fill in all required fields:', errors)
      return false
    }

    setLoading(true)
    try {
      const idLine = user?.id_line || 59
      const fullDateTime = getFullJakartaDateTime()

      const payload = {
        date: formData.date,
        hour: parseInt(formData.hour),
        style: selectedOrc.style,
        orc: selectedOrc.orc,
        buyer: selectedOrc.buyer,
        id_line: idLine,
        status: 0
      }

      console.log(' [handleFormSubmit] Payload:', payload)

      const response = await storeHourlyOutput(payload)
      const headerId = response.data?.id_output || response.id_output

      showAlertMessage('success', 'Header output saved successfully')

      const headerData = {
        id_output: headerId,
        style: selectedOrc.style,
        orc: selectedOrc.orc,
        buyer: selectedOrc.buyer,
        date: formData.date,
        hour: formData.hour,
        id_line: user?.id_line || 59,
        created_at: fullDateTime
      }

      detailHook.setCurrentHeaderData(headerData)
      detailHook.setShowDetailProcess(true)
      await detailHook.loadDetailProcess(selectedOrc.style, idLine)

      return true
    } catch (error) {
      console.error('Error saving:', error)
      showAlertMessage('error', 'Failed to save header output')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, showAlertMessage, detailHook, hourValidation])

  const handleSaveDetailProcess = useCallback(async (detailData, input, headerData) => {
    setLoading(true)
    try {
      const hasInput = Object.values(input).some(val => val > 0)
      if (!hasInput) {
        showAlertMessage('error', 'At least one output must be filled')
        setLoading(false)
        return false
      }

      const firstDetail = detailData[0]
      const detailPayload = {
        id_output: headerData.id_output,
        id_operation_breakdown: firstDetail.idob,
        details: detailData.map(detail => ({
          id_employe: detail.empID,
          output: parseInt(input[detail.op_code]) || 0,
          operation_name: detail.op_name,
          operation_code: detail.op_code,
          target: Math.round(detail.target_per_day) || 0
        }))
      }

      console.log(' [handleSaveDetailProcess] Final Payload:', detailPayload)

      await storeDetailOutput(detailPayload)
      showAlertMessage('success', 'Detail output saved successfully')

      detailHook.handleCancel()

      //  Reload data dan refresh validation
      await loadInitialData()
      await hourValidation.refreshValidation()

      window.scrollTo({ top: 0, behavior: 'smooth' })

      return true
    } catch (error) {
      console.error('Error saving detail:', error)
      showAlertMessage('error', 'Failed to save detail output')
      return false
    } finally {
      setLoading(false)
    }
  }, [showAlertMessage, detailHook, hourValidation, loadInitialData])

  return {
    orcList,
    setOrcList,
    filteredOrcList,
    setFilteredOrcList,
    outputs,
    setOutputs,
    loading,
    loadInitialData,
    handleFormSubmit,
    handleSaveDetailProcess
  }
}