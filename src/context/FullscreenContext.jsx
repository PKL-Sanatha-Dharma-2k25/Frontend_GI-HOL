import { useState, useEffect, createContext, useContext } from 'react'

const FullscreenContext = createContext()

export function FullscreenProvider({ children }) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [screenSize, setScreenSize] = useState(getScreenSize())

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(getScreenSize())
        }

        window.addEventListener('resize', handleResize)

        const handleKeyPress = (e) => {
            if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
                const activeElement = document.activeElement
                if (!['INPUT', 'TEXTAREA'].includes(activeElement?.tagName)) {
                    e.preventDefault()
                    setIsFullscreen(prev => !prev)
                }
            }

            if (e.key === 'Escape') {
                if (isFullscreen) {
                    e.preventDefault()
                    setIsFullscreen(false)
                }
            }

            if ((e.key === '+' || e.key === '=') && isFullscreen) {
                e.preventDefault()
                setZoomLevel(prev => Math.min(prev + 0.2, 3))
            }

            if ((e.key === '-' || e.key === '_') && isFullscreen) {
                e.preventDefault()
                setZoomLevel(prev => Math.max(prev - 0.2, 0.8))
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => {
            window.removeEventListener('keydown', handleKeyPress)
            window.removeEventListener('resize', handleResize)
        }
    }, [isFullscreen])

    return (
        <FullscreenContext.Provider value={{ isFullscreen, setIsFullscreen, zoomLevel, setZoomLevel, screenSize }}>
            {children}
        </FullscreenContext.Provider>
    )
}

function getScreenSize() {
    const width = window.innerWidth
    if (width >= 3840) return 'ultra4k'
    if (width >= 2560) return '4k'
    if (width >= 1920) return 'fhd'
    if (width >= 1366) return 'hd'
    return 'small'
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFullscreen() {
    const context = useContext(FullscreenContext)
    if (!context) {
        throw new Error('useFullscreen must be used within FullscreenProvider')
    }
    return context
}
