import { Heart, Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-blue-50/30 to-white border-t border-slate-100 px-3 sm:px-6 py-2 sm:py-3 z-10 md:left-20 shadow-sm backdrop-blur-sm">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .footer-content {
          animation: slideUp 0.5s ease-out;
        }
        .pulse-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="footer-content max-w-7xl mx-auto">
        {/* Mobile Layout - Ultra Compact */}
        <div className="sm:hidden flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-dot flex-shrink-0"></div>
            <span className="text-slate-600 font-medium truncate">Live</span>
          </div>
          
          <div className="text-slate-600 font-mono">{formattedTime}</div>
          
          <div className="text-slate-500">© {currentYear}</div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          
          {/* Left - Status & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-slate-600 font-medium truncate">Live</span>
            </div>
            
            {/* Divider */}
            <div className="w-px h-4 bg-slate-200"></div>
            
            {/* Copyright */}
            <span className="text-xs sm:text-sm text-slate-600 font-medium">
              © {currentYear} <span className="font-bold text-slate-900">MIS Team</span>
            </span>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200/60">
            <span className="text-xs sm:text-sm text-slate-600">System:</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700">Operational</span>
          </div>

          {/* Right - Time & Built */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Time */}
            <div className="text-xs sm:text-sm text-slate-600 font-mono bg-slate-50/60 px-2.5 py-1 rounded-lg border border-slate-200/60">
              {formattedTime}
            </div>
            
            {/* Divider */}
            <div className="w-px h-4 bg-slate-200"></div>
            
            {/* Built with */}
            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 min-w-0">
              <Code2 size={14} className="flex-shrink-0" />
              <span className="hidden lg:inline">Built with</span>
              <Heart size={14} className="text-red-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}