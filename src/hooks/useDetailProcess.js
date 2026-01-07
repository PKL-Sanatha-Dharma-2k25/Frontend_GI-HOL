import { useState, useCallback } from 'react'
import { getDetailOutputByStyle } from '@/services/apiService'

export function useDetailProcess(showAlertMessage) {
  const [showDetailProcess, setShowDetailProcess] = useState(false)
  const [detailProcessData, setDetailProcessData] = useState([])
  const [detailProcessInput, setDetailProcessInput] = useState({})
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
      
      // Initialize dengan kosong, bukan 0
      const initialInput = {}
      data.forEach(item => {
        initialInput[item.op_code] = ''
      })
      setDetailProcessInput(initialInput)
    } catch (error) {
      console.error('Error loading detail:', error)
      showAlertMessage('error', 'Failed to load detail process')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleActualOutputChange = useCallback((opCode, value) => {
    // Keep as empty string if user belum input, jangan convert ke 0
    const numValue = value === '' ? '' : parseInt(value) || 0
    setDetailProcessInput(prev => ({
      ...prev,
      [opCode]: numValue
    }))
  }, [])

  const handleCancel = useCallback(() => {
    setShowDetailProcess(false)
    setDetailProcessData([])
    setDetailProcessInput({})
    setCurrentHeaderData(null)
  }, [])

  return {
    showDetailProcess,
    setShowDetailProcess,
    detailProcessData,
    setDetailProcessData,
    detailProcessInput,
    setDetailProcessInput,
    currentHeaderData,
    setCurrentHeaderData,
    loadingDetail,
    loadDetailProcess,
    handleActualOutputChange,
    handleCancel
  }
}