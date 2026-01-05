import { useState, useRef, useCallback } from 'react'

export function useAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertDetails, setAlertDetails] = useState([])
  
  // ✅ Store timeout reference untuk bisa di-clear
  const timeoutRef = useRef(null)

  const showAlertMessage = useCallback((type, message, details = []) => {
    // ✅ Clear timeout sebelumnya kalau ada
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set state baru
    setAlertType(type)
    setAlertMessage(message)
    setAlertDetails(details)
    setShowAlert(true)

    // ✅ Set timeout baru dan simpan reference-nya
    timeoutRef.current = setTimeout(() => {
      setShowAlert(false)
      timeoutRef.current = null
    }, 4000)
  }, [])

  return {
    showAlert,
    setShowAlert,
    alertType,
    alertMessage,
    alertDetails,
    showAlertMessage
  }
}