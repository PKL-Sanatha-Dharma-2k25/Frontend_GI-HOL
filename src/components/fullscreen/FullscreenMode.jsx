import { useState, useEffect, createContext, useContext } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

// ============================================
// FULLSCREEN CONTEXT - Global State Management
// ============================================
const FullscreenContext = createContext()

export function FullscreenProvider({ children }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [screenSize, setScreenSize] = useState(getScreenSize())

  useEffect(() => {
    // Update screen size when window resizes
    const handleResize = () => {
      setScreenSize(getScreenSize())
    }
    
    window.addEventListener('resize', handleResize)

    // Keyboard shortcuts handler
    const handleKeyPress = (e) => {
      // F key untuk toggle fullscreen
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        const activeElement = document.activeElement
        if (!['INPUT', 'TEXTAREA'].includes(activeElement?.tagName)) {
          e.preventDefault()
          setIsFullscreen(prev => !prev)
        }
      }
      
      // ESC key untuk exit fullscreen
      if (e.key === 'Escape') {
        if (isFullscreen) {
          e.preventDefault()
          setIsFullscreen(false)
        }
      }

      // + key untuk increase zoom (hanya saat fullscreen)
      if ((e.key === '+' || e.key === '=') && isFullscreen) {
        e.preventDefault()
        setZoomLevel(prev => Math.min(prev + 0.2, 3))
      }

      // - key untuk decrease zoom (hanya saat fullscreen)
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

export function useFullscreen() {
  const context = useContext(FullscreenContext)
  if (!context) {
    throw new Error('useFullscreen must be used within FullscreenProvider')
  }
  return context
}

// ============================================
// FULLSCREEN LAYOUT WRAPPER
// ============================================
export function FullscreenLayout({ children }) {
  const { isFullscreen, zoomLevel, screenSize } = useFullscreen()

  if (!isFullscreen) {
    return <>{children}</>
  }

  // Calculate base scale based on screen resolution
  const screenWidth = window.innerWidth
  let baseScale = 1

  if (screenWidth >= 3840) baseScale = 2.2
  else if (screenWidth >= 2560) baseScale = 1.8
  else if (screenWidth >= 1920) baseScale = 1.5
  else if (screenWidth >= 1366) baseScale = 1.2
  else baseScale = 1

  const finalScale = baseScale * zoomLevel

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Exit Button - Fixed Position, Not Scaled */}
      <FullscreenExitButton />

      {/* Screen Size Debug Info - Top Left */}
      <ScreenSizeIndicator screenSize={screenSize} />

      {/* Main Content Container - Scaled */}
      <div
        className="origin-top-left transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${finalScale})`,
          transformOrigin: 'top left',
          width: `${100 / finalScale}%`,
          minHeight: `${100 / finalScale}%`
        }}
      >
        <div className="fullscreen-content-wrapper">
          {children}
        </div>
      </div>

      {/* Keyboard Hints - Fixed Position, Not Scaled */}
      <FullscreenHints zoomLevel={zoomLevel} />

      {/* Global Styles untuk Fullscreen Mode */}
      <style>{`
        body.fullscreen-mode {
          overflow: hidden;
        }

        .fullscreen-content-wrapper {
          padding: 2rem;
          font-size: 1rem;
          line-height: 1.6;
          background: white;
          color: #000;
          min-height: 100vh;
        }

        /* ===== TYPOGRAPHY ===== */
        .fullscreen-content-wrapper h1,
        .fullscreen-content-wrapper h2,
        .fullscreen-content-wrapper h3,
        .fullscreen-content-wrapper h4,
        .fullscreen-content-wrapper h5,
        .fullscreen-content-wrapper h6 {
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .fullscreen-content-wrapper p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .fullscreen-content-wrapper a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .fullscreen-content-wrapper a:hover {
          color: #1d4ed8;
        }

        /* ===== BUTTONS ===== */
        .fullscreen-content-wrapper button {
          min-height: 50px;
          padding: 0.75rem 1.5rem;
          font-size: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .fullscreen-content-wrapper button:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .fullscreen-content-wrapper button:active {
          background: #e5e7eb;
        }

        .fullscreen-content-wrapper button[class*="bg-blue"] {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .fullscreen-content-wrapper button[class*="bg-red"] {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .fullscreen-content-wrapper button[class*="bg-green"] {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        /* ===== INPUTS & FORMS ===== */
        .fullscreen-content-wrapper input,
        .fullscreen-content-wrapper select,
        .fullscreen-content-wrapper textarea {
          min-height: 45px;
          padding: 0.5rem 1rem;
          font-size: inherit;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          color: #000;
          font-family: inherit;
        }

        .fullscreen-content-wrapper input:focus,
        .fullscreen-content-wrapper select:focus,
        .fullscreen-content-wrapper textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .fullscreen-content-wrapper input::placeholder {
          color: #9ca3af;
        }

        /* ===== CARDS & CONTAINERS ===== */
        .fullscreen-content-wrapper [class*="rounded-lg"],
        .fullscreen-content-wrapper [class*="rounded-xl"],
        .fullscreen-content-wrapper .card {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          margin-bottom: 1rem;
        }

        /* ===== TABLES ===== */
        .fullscreen-content-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          background: white;
        }

        .fullscreen-content-wrapper th {
          padding: 1rem;
          text-align: left;
          background: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #1f2937;
        }

        .fullscreen-content-wrapper td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .fullscreen-content-wrapper tr:hover {
          background: #f9fafb;
        }

        /* ===== CHARTS & SVG ===== */
        .fullscreen-content-wrapper svg {
          width: 100%;
          height: auto;
          margin-bottom: 1rem;
        }

        .fullscreen-content-wrapper svg[class*="lucide"] {
          width: auto;
          height: 1em;
          display: inline;
        }

        /* ===== GRIDS ===== */
        .fullscreen-content-wrapper .grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .fullscreen-content-wrapper .grid-cols-1 {
          grid-template-columns: 1fr;
        }

        .fullscreen-content-wrapper .grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .fullscreen-content-wrapper .grid-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .fullscreen-content-wrapper .grid-cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        /* ===== FLEXBOX ===== */
        .fullscreen-content-wrapper .flex {
          display: flex;
        }

        .fullscreen-content-wrapper .flex-col {
          flex-direction: column;
        }

        .fullscreen-content-wrapper .gap-4 {
          gap: 2rem;
        }

        .fullscreen-content-wrapper .gap-6 {
          gap: 3rem;
        }

        /* ===== SPACING ===== */
        .fullscreen-content-wrapper .space-y-4 > * + * {
          margin-top: 2rem;
        }

        .fullscreen-content-wrapper .space-y-6 > * + * {
          margin-top: 3rem;
        }

        .fullscreen-content-wrapper .mb-4 {
          margin-bottom: 2rem;
        }

        .fullscreen-content-wrapper .mb-6 {
          margin-bottom: 3rem;
        }

        /* ===== ALERTS & BADGES ===== */
        .fullscreen-content-wrapper [class*="alert"],
        .fullscreen-content-wrapper [class*="badge"] {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .fullscreen-content-wrapper [class*="bg-red"] {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .fullscreen-content-wrapper [class*="bg-green"] {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .fullscreen-content-wrapper [class*="bg-yellow"] {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .fullscreen-content-wrapper [class*="bg-blue"] {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        /* ===== LISTS ===== */
        .fullscreen-content-wrapper ul,
        .fullscreen-content-wrapper ol {
          margin-left: 2rem;
          margin-bottom: 1rem;
        }

        .fullscreen-content-wrapper li {
          margin-bottom: 0.5rem;
        }

        /* ===== SCROLLBAR ===== */
        .fullscreen-content-wrapper::-webkit-scrollbar {
          width: 15px;
        }

        .fullscreen-content-wrapper::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .fullscreen-content-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .fullscreen-content-wrapper::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fullscreen-content-wrapper {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// ============================================
// SCREEN SIZE INDICATOR
// ============================================
function ScreenSizeIndicator({ screenSize }) {
  const sizeNames = {
    'ultra4k': '📺 Ultra 4K (3840px+)',
    '4k': '📺 4K (2560px)',
    'fhd': '📺 Full HD (1920px)',
    'hd': '📺 HD (1366px)',
    'small': '📱 Small Screen'
  }

  return (
    <div className="fixed top-6 left-6 z-40 bg-slate-600 text-white px-4 py-2 rounded text-xs font-semibold shadow-lg opacity-60 hover:opacity-100 transition-opacity">
      {sizeNames[screenSize]}
    </div>
  )
}

// ============================================
// EXIT FULLSCREEN BUTTON
// ============================================
function FullscreenExitButton() {
  const { isFullscreen, setIsFullscreen } = useFullscreen()

  if (!isFullscreen) return null

  return (
    <button
      onClick={() => setIsFullscreen(false)}
      className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg font-bold flex items-center gap-2 transition-all"
      title="Exit fullscreen (Press ESC)"
    >
      <Minimize2 size={20} />
      <span>Exit (ESC)</span>
    </button>
  )
}

// ============================================
// FULLSCREEN TOGGLE BUTTON (untuk dashboard)
// ============================================
export function FullscreenToggleButton() {
  const { isFullscreen, setIsFullscreen } = useFullscreen()

  return (
    <button
      onClick={() => setIsFullscreen(!isFullscreen)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isFullscreen
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
      }`}
      title="Toggle fullscreen (Press F)"
    >
      {isFullscreen ? (
        <>
          <Minimize2 size={16} />
          <span>Exit Fullscreen</span>
        </>
      ) : (
        <>
          <Maximize2 size={16} />
          <span>Fullscreen</span>
        </>
      )}
    </button>
  )
}

// ============================================
// KEYBOARD HINTS DIALOG
// ============================================
function FullscreenHints({ zoomLevel }) {
  const { isFullscreen } = useFullscreen()
  const [showHints, setShowHints] = useState(true)

  useEffect(() => {
    if (!isFullscreen) {
      setShowHints(true)
      return
    }

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => setShowHints(false), 8000)
    return () => clearTimeout(timer)
  }, [isFullscreen])

  if (!isFullscreen || !showHints) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-blue-50 border-2 border-blue-300 rounded-lg p-5 shadow-lg max-w-sm text-sm">
      <div className="flex items-center gap-2 font-bold mb-3 text-base">
        <span>⌨️</span>
        <span>Keyboard Shortcuts</span>
      </div>

      <div className="space-y-2 text-blue-900 text-xs">
        <div className="flex items-center gap-3">
          <kbd className="bg-blue-200 px-2 py-1 rounded font-mono font-bold text-xs border border-blue-300">F</kbd>
          <span>Toggle fullscreen</span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="bg-blue-200 px-2 py-1 rounded font-mono font-bold text-xs border border-blue-300">ESC</kbd>
          <span>Exit fullscreen</span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="bg-blue-200 px-2 py-1 rounded font-mono font-bold text-xs border border-blue-300">+</kbd>
          <span>Zoom in</span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="bg-blue-200 px-2 py-1 rounded font-mono font-bold text-xs border border-blue-300">−</kbd>
          <span>Zoom out</span>
        </div>

        <div className="bg-white rounded p-2 mt-2 text-xs border border-blue-200">
          <strong>Zoom:</strong> {(zoomLevel * 100).toFixed(0)}%
        </div>

        <button
          onClick={() => setShowHints(false)}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ============================================
// STATUS INDICATOR (Optional)
// ============================================
export function FullscreenStatusIndicator() {
  const { isFullscreen, screenSize } = useFullscreen()

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${isFullscreen ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
      <span className={isFullscreen ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
        {isFullscreen ? `🖥️ Fullscreen (${screenSize})` : 'Normal'}
      </span>
    </div>
  )
}

export default FullscreenLayout