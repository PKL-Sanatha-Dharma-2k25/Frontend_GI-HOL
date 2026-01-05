import { useState, useCallback } from 'react'
import { 
  getOrcSewing, 
  getHourlyOutputHeader,
  storeHourlyOutput,
  storeDetailOutput 
} from '@/services/apiService'
import { getFullJakartaDateTime } from '@/utils/dateTime'

export function useHourlyOutput(user, showAlertMessage, detailHook) {
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

    // ✅ Validasi yang lebih robust
    // Date validation
    if (!formData.date || formData.date.trim() === '') {
      errors.push('* Date is required')
    }
    
    // Hour validation - PENTING: cek apakah hour kosong atau "0"
    if (!formData.hour || formData.hour.trim() === '' || formData.hour === '0') {
      errors.push('* Hour is required')
    }
    
    // ORC validation
    if (!selectedOrc) {
      errors.push('* ORC is required')
    }

    // ❌ Jika ada error, tampilkan dan return false
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

      console.log('📤 [handleFormSubmit] Payload:', JSON.stringify(payload, null, 2))
      console.log('🕐 Frontend time:', fullDateTime)

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

      console.log('💾 [handleSaveDetailProcess] Final Payload:', JSON.stringify(detailPayload, null, 2))

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
  }, [showAlertMessage, detailHook])

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