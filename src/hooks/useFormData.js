import { useState, useEffect, useRef } from 'react'
import { getJakartaTime } from '@/utils/dateTime'

export function useFormData(user) {
  const [formData, setFormData] = useState(() => {
    const { date } = getJakartaTime()
    // ✅ PENTING: hour harus kosong di awal, user harus pilih manual
    return { date, hour: '', line: '' }
  })
  const [selectedOrc, setSelectedOrc] = useState(null)
  const [orcSearchTerm, setOrcSearchTerm] = useState('')
  const [showOrcDropdown, setShowOrcDropdown] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // ✅ Hanya set line saat first render saja, tidak setiap kali user berubah
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
      hour: '', // ✅ Reset ke kosong, jangan ambil dari getJakartaTime()
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