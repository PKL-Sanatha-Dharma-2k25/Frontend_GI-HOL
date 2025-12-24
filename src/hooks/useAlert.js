import { useState } from 'react'

export function useAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertDetails, setAlertDetails] = useState([])

  const showAlertMessage = (type, message, details = []) => {
    setAlertType(type)
    setAlertMessage(message)
    setAlertDetails(details)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 4000)
  }

  return {
    showAlert,
    setShowAlert,
    alertType,
    alertMessage,
    alertDetails,
    showAlertMessage
  }
}