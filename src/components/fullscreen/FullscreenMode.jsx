import { useState, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useFullscreen } from '@/context/FullscreenContext'



// ============================================
// FULLSCREEN LAYOUT WRAPPER
// ============================================
export function FullscreenLayout({ children }) {
  const { isFullscreen, zoomLevel, screenSize } = useFullscreen()

  if (!isFullscreen) {
    return <>{children}</>
  }

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
      <ScreenSizeIndicator screenSize={screenSize} />

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

      <FullscreenHints zoomLevel={zoomLevel} />

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
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .fullscreen-content-wrapper h1 { font-size: 2.5rem; }
        .fullscreen-content-wrapper h2 { font-size: 2rem; }
        .fullscreen-content-wrapper h3 { font-size: 1.5rem; }
        .fullscreen-content-wrapper h4 { font-size: 1.25rem; }

        .fullscreen-content-wrapper p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #374151;
        }

        .fullscreen-content-wrapper a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .fullscreen-content-wrapper a:hover {
          color: #1d4ed8;
        }

        /* ===== BUTTONS - COMPREHENSIVE ===== */
        .fullscreen-content-wrapper button,
        .fullscreen-content-wrapper [role="button"] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          background: white;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          user-select: none;
          text-decoration: none;
        }

        /* Default Button Style */
        .fullscreen-content-wrapper button:not([class*="bg-"]):not([class*="text-"]) {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #1f2937;
        }

        .fullscreen-content-wrapper button:not([class*="bg-"]):not([class*="text-"]):hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .fullscreen-content-wrapper button:not([class*="bg-"]):not([class*="text-"]):active {
          background: #d1d5db;
        }

        /* Primary Blue Button */
        .fullscreen-content-wrapper button[class*="bg-blue"],
        .fullscreen-content-wrapper button[class*="bg-blue-500"],
        .fullscreen-content-wrapper button[class*="bg-blue-600"] {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #2563eb;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
        }

        .fullscreen-content-wrapper button[class*="bg-blue"]:hover,
        .fullscreen-content-wrapper button[class*="bg-blue-500"]:hover,
        .fullscreen-content-wrapper button[class*="bg-blue-600"]:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
          transform: translateY(-1px);
        }

        .fullscreen-content-wrapper button[class*="bg-blue"]:active,
        .fullscreen-content-wrapper button[class*="bg-blue-500"]:active,
        .fullscreen-content-wrapper button[class*="bg-blue-600"]:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.3);
        }

        /* Success Green Button */
        .fullscreen-content-wrapper button[class*="bg-green"],
        .fullscreen-content-wrapper button[class*="bg-green-500"],
        .fullscreen-content-wrapper button[class*="bg-green-600"] {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #059669;
          box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
        }

        .fullscreen-content-wrapper button[class*="bg-green"]:hover,
        .fullscreen-content-wrapper button[class*="bg-green-500"]:hover,
        .fullscreen-content-wrapper button[class*="bg-green-600"]:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 8px rgba(5, 150, 105, 0.4);
          transform: translateY(-1px);
        }

        .fullscreen-content-wrapper button[class*="bg-green"]:active,
        .fullscreen-content-wrapper button[class*="bg-green-500"]:active,
        .fullscreen-content-wrapper button[class*="bg-green-600"]:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(5, 150, 105, 0.3);
        }

        /* Danger Red Button */
        .fullscreen-content-wrapper button[class*="bg-red"],
        .fullscreen-content-wrapper button[class*="bg-red-500"],
        .fullscreen-content-wrapper button[class*="bg-red-600"] {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-color: #dc2626;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
        }

        .fullscreen-content-wrapper button[class*="bg-red"]:hover,
        .fullscreen-content-wrapper button[class*="bg-red-500"]:hover,
        .fullscreen-content-wrapper button[class*="bg-red-600"]:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 4px 8px rgba(220, 38, 38, 0.4);
          transform: translateY(-1px);
        }

        .fullscreen-content-wrapper button[class*="bg-red"]:active,
        .fullscreen-content-wrapper button[class*="bg-red-500"]:active,
        .fullscreen-content-wrapper button[class*="bg-red-600"]:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(220, 38, 38, 0.3);
        }

        /* Warning Yellow Button */
        .fullscreen-content-wrapper button[class*="bg-yellow"],
        .fullscreen-content-wrapper button[class*="bg-yellow-500"],
        .fullscreen-content-wrapper button[class*="bg-amber"] {
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
          color: white;
          border-color: #ca8a04;
          box-shadow: 0 2px 4px rgba(202, 138, 4, 0.3);
        }

        .fullscreen-content-wrapper button[class*="bg-yellow"]:hover,
        .fullscreen-content-wrapper button[class*="bg-yellow-500"]:hover,
        .fullscreen-content-wrapper button[class*="bg-amber"]:hover {
          background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%);
          box-shadow: 0 4px 8px rgba(202, 138, 4, 0.4);
          transform: translateY(-1px);
        }

        .fullscreen-content-wrapper button[class*="bg-yellow"]:active,
        .fullscreen-content-wrapper button[class*="bg-yellow-500"]:active,
        .fullscreen-content-wrapper button[class*="bg-amber"]:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(202, 138, 4, 0.3);
        }

        /* Outline/Secondary Button */
        .fullscreen-content-wrapper button[class*="border-"],
        .fullscreen-content-wrapper button.secondary {
          background: white;
          border: 2px solid #d1d5db;
          color: #374151;
        }

        .fullscreen-content-wrapper button[class*="border-"]:hover,
        .fullscreen-content-wrapper button.secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Disabled State */
        .fullscreen-content-wrapper button:disabled,
        .fullscreen-content-wrapper button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .fullscreen-content-wrapper button:disabled:hover,
        .fullscreen-content-wrapper button[disabled]:hover {
          transform: none !important;
        }

        /* Small Button Size */
        .fullscreen-content-wrapper button[class*="text-sm"],
        .fullscreen-content-wrapper button.btn-sm {
          min-height: 36px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        /* Large Button Size */
        .fullscreen-content-wrapper button[class*="text-lg"],
        .fullscreen-content-wrapper button.btn-lg {
          min-height: 52px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        /* Full Width Button */
        .fullscreen-content-wrapper button[class*="w-full"],
        .fullscreen-content-wrapper button.btn-full {
          width: 100%;
        }

        /* Button Group - Horizontal Layout */
        .fullscreen-content-wrapper .button-group,
        .fullscreen-content-wrapper .flex.gap-2,
        .fullscreen-content-wrapper .flex.gap-3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin: 1rem 0;
        }

        .fullscreen-content-wrapper .button-group.vertical {
          flex-direction: column;
          align-items: stretch;
        }

        /* ===== INPUTS & FORMS ===== */
        .fullscreen-content-wrapper input,
        .fullscreen-content-wrapper select,
        .fullscreen-content-wrapper textarea {
          min-height: 44px;
          padding: 0.75rem 1rem;
          font-size: inherit;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          color: #1f2937;
          font-family: inherit;
          transition: all 0.2s ease;
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
          border-radius: 0.75rem;
          background: white;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        /* ===== TABLES ===== */
        .fullscreen-content-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .fullscreen-content-wrapper th {
          padding: 1rem;
          text-align: left;
          background: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 700;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .fullscreen-content-wrapper td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .fullscreen-content-wrapper tr:hover {
          background: #f9fafb;
        }

        /* ===== GRIDS ===== */
        .fullscreen-content-wrapper .grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
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
          gap: 1.5rem;
        }

        .fullscreen-content-wrapper .gap-6 {
          gap: 2rem;
        }

        /* ===== SPACING ===== */
        .fullscreen-content-wrapper .space-y-4 > * + * {
          margin-top: 1.5rem;
        }

        .fullscreen-content-wrapper .space-y-6 > * + * {
          margin-top: 2rem;
        }

        .fullscreen-content-wrapper .mb-4 {
          margin-bottom: 1.5rem;
        }

        .fullscreen-content-wrapper .mb-6 {
          margin-bottom: 2rem;
        }

        /* ===== ALERTS & BADGES ===== */
        .fullscreen-content-wrapper [class*="alert"],
        .fullscreen-content-wrapper [class*="badge"] {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
          display: inline-block;
        }

        /* ===== LISTS ===== */
        .fullscreen-content-wrapper ul,
        .fullscreen-content-wrapper ol {
          margin-left: 2rem;
          margin-bottom: 1rem;
        }

        .fullscreen-content-wrapper li {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }

        /* ===== SCROLLBAR ===== */
        .fullscreen-content-wrapper::-webkit-scrollbar {
          width: 12px;
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
// FULLSCREEN TOGGLE BUTTON
// ============================================
export function FullscreenToggleButton() {
  const { isFullscreen, setIsFullscreen } = useFullscreen()

  return (
    <button
      onClick={() => setIsFullscreen(!isFullscreen)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isFullscreen
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
    const timer = setTimeout(() => setShowHints(false), 8000)
    return () => clearTimeout(timer)
  }, [])

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
// STATUS INDICATOR
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

// ============================================
// DEMO COMPONENT
// ============================================
function DemoPage() {
  return (
    <div>
      <h1>Button Styling Demo</h1>
      <p>Berikut adalah contoh berbagai style button yang sudah dirapi:</p>

      <h2>Primary Buttons</h2>
      <div className="button-group">
        <button className="bg-blue-600">Primary Button</button>
        <button className="bg-blue-600 text-sm">Small</button>
        <button className="bg-blue-600 text-lg">Large</button>
      </div>

      <h2>Success Buttons</h2>
      <div className="button-group">
        <button className="bg-green-600">Save Changes</button>
        <button className="bg-green-600">Confirm</button>
      </div>

      <h2>Danger Buttons</h2>
      <div className="button-group">
        <button className="bg-red-600">Delete</button>
        <button className="bg-red-600">Cancel Order</button>
      </div>

      <h2>Warning Buttons</h2>
      <div className="button-group">
        <button className="bg-yellow-500">Warning</button>
      </div>

      <h2>Secondary/Outline Buttons</h2>
      <div className="button-group">
        <button className="border-gray-300">Secondary</button>
        <button className="border-gray-300">View All Hours</button>
        <button className="border-gray-300">More Options</button>
      </div>

      <h2>Disabled State</h2>
      <div className="button-group">
        <button className="bg-blue-600" disabled>Disabled Button</button>
        <button className="border-gray-300" disabled>Disabled Outline</button>
      </div>

      <h2>Full Width Button</h2>
      <button className="bg-blue-600 w-full">Full Width Button</button>

      <h2>Button Group - Vertical</h2>
      <div className="button-group vertical">
        <button className="bg-blue-600">Option 1</button>
        <button className="border-gray-300">Option 2</button>
        <button className="bg-green-600">Confirm</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <FullscreenProvider>
      <div className="p-6">
        <FullscreenToggleButton />
        <FullscreenStatusIndicator />
        <hr className="my-6" />
      </div>
      <FullscreenLayout>
        <DemoPage />
      </FullscreenLayout>
    </FullscreenProvider>
  )
}