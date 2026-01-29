import { useState, useCallback } from 'react'
import {
  getOrcSewing,
  getHourlyOutputHeader,
  storeHourlyOutput,
  storeDetailOutput
} from '@/services/apiService'
import { getFullJakartaDateTime, getJakartaTime } from '@/utils/dateTime'

export function useHourlyOutput(user, alert, detailHook) {
  const { showAlertMessage, showConfirm } = alert
  const [orcList, setOrcList] = useState([])
  const [filteredOrcList, setFilteredOrcList] = useState([])
  const [outputs, setOutputs] = useState([])
  const [loading, setLoading] = useState(false)

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    try {
      const orcData = await getOrcSewing()
      setOrcList(orcData.data || orcData || [])
      setFilteredOrcList(orcData.data || orcData || [])

      const outputData = await getHourlyOutputHeader()
      setOutputs(outputData.data || outputData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      showAlertMessage('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [showAlertMessage])

  const handleFormSubmit = useCallback(async (formData, selectedOrc) => {
    const errors = []

    const today = getJakartaTime().date
    if (!formData.date || formData.date.trim() === '') {
      errors.push('* Date is required')
    } else if (formData.date > today) {
      errors.push('* Cannot submit output for future date')
    }

    // Hour validation
    if (!formData.hour || formData.hour.trim() === '' || formData.hour === '0') {
      errors.push('* Hour is required')
    }

    // ORC validation
    if (!selectedOrc) {
      errors.push('* ORC is required')
    }

    // Jika ada error, tampilkan dan return false
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
  }, [user, showAlertMessage, detailHook])

  const handleSaveDetailProcess = useCallback(async (detailData, input, repair, reject, headerData) => {
    setLoading(true)
    try {
      const hasInput = Object.values(input).some(val => val > 0)
      if (!hasInput) {
        showAlertMessage('error', 'At least one output must be filled')
        setLoading(false)
        return false
      }

      const firstDetail = detailData[0]
      const excessiveOutputs = []
      const skippedOperations = []

      // Filter and map details, excluding operations without employee
      const validDetails = detailData
        .filter(detail => {
          // Skip if no employee assigned
          if (!detail.empID || detail.empID === null || detail.empID === 0) {
            const out = parseInt(input[detail.op_code]) || 0
            // Only warn if there's actual output for this operation
            if (out > 0) {
              skippedOperations.push(`${detail.op_code} - ${detail.op_name} (no employee assigned)`)
            }
            console.warn(`⚠️ Skipping ${detail.op_code} - No employee assigned`)
            return false
          }
          return true
        })
        .map(detail => {
          const out = parseInt(input[detail.op_code]) || 0
          const target = Math.round(detail.target_per_day) || 0

          if (target > 0 && out > target * 3) {
            excessiveOutputs.push(`${detail.op_code} (${out} vs target ${target})`)
          }

          return {
            id_employe: detail.empID,
            output: out,
            repair: parseInt(repair[detail.op_code]) || 0,
            reject: parseInt(reject[detail.op_code]) || 0,
            operation_name: detail.op_name,
            operation_code: detail.op_code,
            target: Math.round(detail.target_per_day) || 0
          }
        })

      const detailPayload = {
        id_output: headerData.id_output,
        id_operation_breakdown: firstDetail.idob,
        details: validDetails
      }


      if (excessiveOutputs.length > 0) {
        const confirm = await showConfirm(
          'Suspiciously high output detected',
          excessiveOutputs
        )
        if (!confirm) {
          setLoading(false)
          return false
        }
      }

      // Warn about skipped operations
      if (skippedOperations.length > 0) {
        const confirm = await showConfirm(
          'The following operations were skipped (no employee assigned)',
          skippedOperations
        )
        if (!confirm) {
          setLoading(false)
          return false
        }
      }

      console.log('📦 Sending payload with', validDetails.length, 'operations (skipped:', detailData.length - validDetails.length, ')')



      await storeDetailOutput(detailPayload)
      showAlertMessage('success', 'Detail output saved successfully')

      detailHook.handleCancel()
      await loadInitialData()
      window.scrollTo({ top: 0, behavior: 'smooth' })

      return true
    } catch (error) {
      console.error('Error saving detail:', error)
      showAlertMessage('error', 'Failed to save detail output')
      return false
    } finally {
      setLoading(false)
    }
  }, [showAlertMessage, showConfirm, detailHook, loadInitialData])

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