import { useState, useRef, useCallback } from 'react'

export function useAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertDetails, setAlertDetails] = useState([])
  const [isConfirm, setIsConfirm] = useState(false)
  const [onConfirm, setOnConfirm] = useState(null)
  const [onCancel, setOnCancel] = useState(null)


  const timeoutRef = useRef(null)

  const showAlertMessage = useCallback((type, message, details = []) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Play Sound
    try {
      const audioUrl = type === 'success'
        ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
        : 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
      const audio = new Audio(audioUrl)
      audio.volume = 0.5
      audio.play().catch(e => console.warn('Audio playback failed:', e))
    } catch (err) {
      console.warn('Audio initialization failed:', err)
    }

    setAlertType(type)
    setAlertMessage(message)
    setAlertDetails(details)
    setIsConfirm(false)
    setShowAlert(true)

    timeoutRef.current = setTimeout(() => {
      setShowAlert(false)
      timeoutRef.current = null
    }, 4000)
  }, [])

  const showConfirm = useCallback((message, details = []) => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setAlertType('warning')
      setAlertMessage(message)
      setAlertDetails(details)
      setIsConfirm(true)

      setOnConfirm(() => () => {
        setShowAlert(false)
        setIsConfirm(false)
        resolve(true)
      })

      setOnCancel(() => () => {
        setShowAlert(false)
        setIsConfirm(false)
        resolve(false)
      })

      setShowAlert(true)
    })
  }, [])

  return {
    showAlert,
    setShowAlert,
    alertType,
    alertMessage,
    alertDetails,
    isConfirm,
    onConfirm,
    onCancel,
    showAlertMessage,
    showConfirm
  }
}