import { useState, useEffect, useRef } from 'react'
import { getJakartaTime } from '@/utils/dateTime'

export function useFormData(user) {
  const [formData, setFormData] = useState(() => {
    const { date } = getJakartaTime()
    
    return { date, hour: '', line: '' }
  })
  const [selectedOrc, setSelectedOrc] = useState(null)
  const [orcSearchTerm, setOrcSearchTerm] = useState('')
  const [showOrcDropdown, setShowOrcDropdown] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
  
    if (isFirstRender.current && user?.username) {
      setFormData(prev => ({ ...prev, line: user.username }))
      isFirstRender.current = false
    }
  }, [])

  const resetForm = () => {
    const { date } = getJakartaTime()
    setFormData(prev => ({ 
      ...prev, 
      date,
      hour: '', 
      line: user?.username || ''
    }))
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }

  const handleOrcSelect = (orc) => {
    setSelectedOrc(orc)
    setOrcSearchTerm(orc.orc)
    setShowOrcDropdown(false)
  }

  const handleClearOrc = () => {
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }

  return {
    formData,
    setFormData,
    selectedOrc,
    setSelectedOrc,
    orcSearchTerm,
    setOrcSearchTerm,
    showOrcDropdown,
    setShowOrcDropdown,
    resetForm,
    handleOrcSelect,
    handleClearOrc
  }
}