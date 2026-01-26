import { useState, useRef, useCallback } from 'react'

export function useAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertDetails, setAlertDetails] = useState([])
  
  
  const timeoutRef = useRef(null)

  const showAlertMessage = useCallback((type, message, details = []) => {
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setAlertType(type)
    setAlertMessage(message)
    setAlertDetails(details)
    setShowAlert(true)

   
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