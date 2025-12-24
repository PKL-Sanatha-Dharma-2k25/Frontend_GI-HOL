import { useState, useCallback } from 'react'
import { getDetailFromDetailOpt, getUpdateFromDetailOpt, updateDetailOutput } from '@/services/apiService'

export function useDetailModal(showAlertMessage) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [detailData, setDetailData] = useState([])
  const [updateData, setUpdateData] = useState([])
  const [updateInput, setUpdateInput] = useState({})
  const [currentModalData, setCurrentModalData] = useState(null)
  const [loadingModal, setLoadingModal] = useState(false)

  // Helper: normalize data structure
  const normalizeData = (rawData) => {
    return rawData.map(item => ({
      id_detail_opt: item.id_detail_opt,
      id_employe: item.id_employe,
      operation_code: item.operation_code || item.op_code,
      operation_name: item.operation_name || item.op_name,
      op_code: item.operation_code || item.op_code,
      op_name: item.operation_name || item.op_name,
      name: item.name,
      output: item.output || 0,
      target: item.target || 0,
      empID: item.empID || item.id_employe
    }))
  }

  // Fetch detail data
  const loadDetailData = useCallback(async (idOutput) => {
    setLoadingModal(true)
    try {
      console.log('👁️ [loadDetailData] Loading with idOutput:', idOutput)
      const response = await getDetailFromDetailOpt(idOutput)
      
      let data = response.data || response || []
      console.log('👁️ [loadDetailData] Raw data:', data)
      
      // Normalize structure
      const normalizedData = normalizeData(data)
      console.log('👁️ [loadDetailData] Normalized data:', normalizedData)
      
      setDetailData(normalizedData)
      setCurrentModalData({ idOutput, type: 'detail' })
      setShowDetailModal(true)
      showAlertMessage('success', `Detail loaded successfully (${normalizedData.length} items)`)
    } catch (error) {
      console.error('❌ Error loading detail:', error)
      showAlertMessage('error', `Failed to load detail data: ${error.message}`)
    } finally {
      setLoadingModal(false)
    }
  }, [showAlertMessage])

  // Fetch update data
  const loadUpdateData = useCallback(async (idOutput) => {
    setLoadingModal(true)
    try {
      console.log('✏️ [loadUpdateData] Loading with idOutput:', idOutput)
      const response = await getUpdateFromDetailOpt(idOutput)
      
      let data = response.data || response || []
      console.log('✏️ [loadUpdateData] Raw data:', data)
      
      // Normalize structure
      const normalizedData = normalizeData(data)
      console.log('✏️ [loadUpdateData] Normalized data:', normalizedData)
      
      // Initialize input dengan data yang sudah ada
      const initialInput = {}
      normalizedData.forEach(item => {
        const opCode = item.operation_code || item.op_code
        initialInput[opCode] = item.output || 0
      })
      
      console.log('✏️ [loadUpdateData] Initial input:', initialInput)
      
      setUpdateData(normalizedData)
      setUpdateInput(initialInput)
      setCurrentModalData({ idOutput, type: 'update' })
      setShowUpdateModal(true)
      showAlertMessage('success', `Update data loaded successfully (${normalizedData.length} items)`)
    } catch (error) {
      console.error('❌ Error loading update data:', error)
      showAlertMessage('error', `Failed to load update data: ${error.message}`)
    } finally {
      setLoadingModal(false)
    }
  }, [showAlertMessage])

  // Handle update input change
  const handleUpdateInputChange = useCallback((opCode, value) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0
    setUpdateInput(prev => ({
      ...prev,
      [opCode]: numValue
    }))
  }, [])

  // Save updated data
  const handleSaveUpdate = useCallback(async (onSuccess) => {
    setLoadingModal(true)
    try {
      const hasInput = Object.values(updateInput).some(val => val > 0)
      if (!hasInput) {
        showAlertMessage('error', 'At least one output must be filled')
        setLoadingModal(false)
        return false
      }

      const updatePayload = {
        id_output: currentModalData.idOutput,
        details: updateData.map(detail => ({
          id_detail_opt: detail.id_detail_opt,
          id_employe: detail.id_employe,
          output: parseInt(updateInput[detail.operation_code || detail.op_code]) || 0,
          operation_name: detail.operation_name || detail.op_name,
          operation_code: detail.operation_code || detail.op_code,
          target: detail.target || 0
        }))
      }

      console.log('🔄 [handleSaveUpdate] Payload:', JSON.stringify(updatePayload, null, 2))

      await updateDetailOutput(updatePayload)
      showAlertMessage('success', 'Detail output updated successfully')
      
      setShowUpdateModal(false)
      setUpdateData([])
      setUpdateInput({})
      setCurrentModalData(null)
      
      if (onSuccess) onSuccess()
      return true
    } catch (error) {
      console.error('❌ Error saving update:', error)
      showAlertMessage('error', `Failed to save update: ${error.message}`)
      return false
    } finally {
      setLoadingModal(false)
    }
  }, [updateData, updateInput, currentModalData, showAlertMessage])

  // Close modals
  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false)
    setDetailData([])
    setCurrentModalData(null)
  }, [])

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModal(false)
    setUpdateData([])
    setUpdateInput({})
    setCurrentModalData(null)
  }, [])

  return {
    showDetailModal,
    showUpdateModal,
    detailData,
    updateData,
    updateInput,
    loadingModal,
    loadDetailData,
    loadUpdateData,
    handleUpdateInputChange,
    handleSaveUpdate,
    closeDetailModal,
    closeUpdateModal
  }
}