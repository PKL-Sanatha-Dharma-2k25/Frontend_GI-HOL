import { useState, useCallback } from 'react'
import { getDetailOutputByStyle } from '@/services/apiService'

export function useDetailProcess(showAlertMessage) {
  const [showDetailProcess, setShowDetailProcess] = useState(false)
  const [detailProcessData, setDetailProcessData] = useState([])
  const [detailProcessInput, setDetailProcessInput] = useState({})
  const [detailProcessRepair, setDetailProcessRepair] = useState({})
  const [detailProcessReject, setDetailProcessReject] = useState({})
  const [currentHeaderData, setCurrentHeaderData] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const loadDetailProcess = async (style, idLine) => {
    setLoadingDetail(true)
    try {
      const detailData = await getDetailOutputByStyle(style, idLine)
      
      let data = detailData.data || detailData || []
      
      const uniqueByOpCode = {}
      data.forEach(item => {
        if (!uniqueByOpCode[item.op_code]) {
          uniqueByOpCode[item.op_code] = item
        }
      })
      
      data = Object.values(uniqueByOpCode)
      setDetailProcessData(data)
      
      // Initialize semua field (actual, repair, reject) dengan kosong
      const initialInput = {}
      const initialRepair = {}
      const initialReject = {}
      data.forEach(item => {
        initialInput[item.op_code] = ''
        initialRepair[item.op_code] = ''
        initialReject[item.op_code] = ''
      })
      setDetailProcessInput(initialInput)
      setDetailProcessRepair(initialRepair)
      setDetailProcessReject(initialReject)
    } catch (error) {
      console.error('Error loading detail:', error)
      showAlertMessage('error', 'Failed to load detail process')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleActualOutputChange = useCallback((opCode, value) => {
    const numValue = value === '' ? '' : parseInt(value) || 0
    setDetailProcessInput(prev => ({
      ...prev,
      [opCode]: numValue
    }))
  }, [])

  const handleRepairChange = useCallback((opCode, value) => {
    const numValue = value === '' ? '' : parseInt(value) || 0
    setDetailProcessRepair(prev => ({
      ...prev,
      [opCode]: numValue
    }))
  }, [])

  const handleRejectChange = useCallback((opCode, value) => {
    const numValue = value === '' ? '' : parseInt(value) || 0
    setDetailProcessReject(prev => ({
      ...prev,
      [opCode]: numValue
    }))
  }, [])

  const handleCancel = useCallback(() => {
    setShowDetailProcess(false)
    setDetailProcessData([])
    setDetailProcessInput({})
    setDetailProcessRepair({})
    setDetailProcessReject({})
    setCurrentHeaderData(null)
  }, [])

  return {
    showDetailProcess,
    setShowDetailProcess,
    detailProcessData,
    setDetailProcessData,
    detailProcessInput,
    setDetailProcessInput,
    detailProcessRepair,
    setDetailProcessRepair,
    detailProcessReject,
    setDetailProcessReject,
    currentHeaderData,
    setCurrentHeaderData,
    loadingDetail,
    loadDetailProcess,
    handleActualOutputChange,
    handleRepairChange,
    handleRejectChange,
    handleCancel
  }
}