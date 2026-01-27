import { useState, useEffect, useCallback } from 'react'
import { getJakartaTime } from '@/utils/dateTime'

export function useFormData(user) {
  const [formData, setFormData] = useState(() => {
    const { date } = getJakartaTime()

    return { date, hour: '', line: user?.username || '' }
  })
  const [selectedOrc, setSelectedOrc] = useState(null)
  const [orcSearchTerm, setOrcSearchTerm] = useState('')
  const [showOrcDropdown, setShowOrcDropdown] = useState(false)

  useEffect(() => {
    if (user?.username && formData.line === '') {
      const timeoutId = setTimeout(() => {
        setFormData(prev => prev.line === '' ? { ...prev, line: user.username } : prev)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [user?.username, formData.line])

  const resetForm = useCallback(() => {
    const { date } = getJakartaTime()
    setFormData(prev => ({
      ...prev,
      date,
      hour: '',
      line: user?.username || ''
    }))
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }, [user?.username])

  const handleOrcSelect = useCallback((orc) => {
    setSelectedOrc(orc)
    setOrcSearchTerm(orc.orc)
    setShowOrcDropdown(false)
  }, [])

  const handleClearOrc = useCallback(() => {
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }, [])

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