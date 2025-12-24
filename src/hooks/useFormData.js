import { useState, useEffect } from 'react'
import { getJakartaTime } from '@/utils/dateTime'

export function useFormData(user) {
  const [formData, setFormData] = useState(() => {
    const { date, hour } = getJakartaTime()
    return { date, hour, line: '' }
  })
  const [selectedOrc, setSelectedOrc] = useState(null)
  const [orcSearchTerm, setOrcSearchTerm] = useState('')
  const [showOrcDropdown, setShowOrcDropdown] = useState(false)

  useEffect(() => {
    if (user?.username) {
      setFormData(prev => ({ ...prev, line: user.username }))
    }
  }, [user])

  const resetForm = () => {
    const { hour } = getJakartaTime()
    setFormData(prev => ({ 
      ...prev, 
      hour,
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