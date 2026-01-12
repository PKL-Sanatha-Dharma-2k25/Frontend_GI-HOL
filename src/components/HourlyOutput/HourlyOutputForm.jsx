import { Plus, ChevronRight, AlertCircle, Check, X } from 'lucide-react'

const HOURS = Array.from({ length: 10 }, (_, i) => String(i + 1))

export default function HourlyOutputForm({
  showForm = true,
  onToggleForm = () => {},
  formData = { line: '', date: '', hour: '' },
  setFormData = () => {},
  selectedOrc = null,
  orcSearchTerm = '',
  setOrcSearchTerm = () => {},
  showOrcDropdown = false,
  setShowOrcDropdown = () => {},
  filteredOrcList = [],
  onOrcSelect = () => {},
  onClearOrc = () => {},
  onSubmit = () => {},
  onCancel = () => {},
  loading = false,
  isHourUsed = () => false,
  getAvailableHours = () => HOURS.map(h => parseInt(h)),
  usedHours = {}
}) {
  
  const availableHours = formData.date ? getAvailableHours(formData.date) : []
  const selectedHourUsed = formData.hour && isHourUsed(formData.date, formData.hour)
  
  const isFormValid = 
    formData.date && 
    formData.date.trim() !== '' && 
    formData.hour && 
    formData.hour.trim() !== '' && 
    selectedOrc &&
    !selectedHourUsed

  const handleOrcSelect = (orc) => {
    onOrcSelect(orc)
    setOrcSearchTerm(orc.orc)
    setShowOrcDropdown(false)
  }

  // ✨ NEW: Smooth animation
  const formSteps = [
    { label: 'ORC', valid: !!selectedOrc, icon: '📦' },
    { label: 'Date', valid: !!formData.date, icon: '📅' },
    { label: 'Hour', valid: !!formData.hour && !selectedHourUsed, icon: '⏰' },
    { label: 'Ready', valid: isFormValid, icon: '✓' }
  ]

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      <style>{`
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 1500px;
            opacity: 1;
          }
        }
        .form-content {
          animation: ${showForm ? 'slideDown 0.4s ease-out' : 'none'};
          overflow: hidden;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header Button */}
      <button
        onClick={() => onToggleForm(!showForm)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-800 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all">
            <Plus size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <span className="font-bold text-white text-base block">Add New Output</span>
            <span className="text-blue-100 text-xs">Enter production data for selected line</span>
          </div>
        </div>
        <ChevronRight
          size={22}
          className={`text-white transition-transform duration-300 flex-shrink-0 ${showForm ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Form Content */}
      <div className="form-content">
        <div className="p-8 border-t border-slate-200 space-y-8 bg-gradient-to-b from-white to-blue-50/50">
          
          {/* Progress Indicator - Enhanced */}
          <div className="flex gap-2 items-center flex-wrap">
            {formSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-all ${
                  step.valid 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  {step.valid && idx < 3 ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  step.valid ? 'text-emerald-600 font-bold' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                {idx < 3 && (
                  <span className={`w-8 h-0.5 mx-1 transition-all ${
                    step.valid ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            
            {/* Line - Read Only */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-blue-100 rounded">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span>Line</span>
              </label>
              <div className="px-4 py-3 border-2 border-blue-300 rounded-lg bg-blue-50 text-sm font-semibold text-slate-900 h-11 flex items-center hover:border-blue-400 transition-colors">
                {formData.line || '-'}
              </div>
            </div>

            {/* ORC Search */}
            <div className="lg:col-span-2 relative">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-orange-100 rounded">
                  <svg className="w-3.5 h-3.5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  </svg>
                </div>
                <span>ORC</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ORC..."
                  value={orcSearchTerm}
                  onChange={(e) => {
                    setOrcSearchTerm(e.target.value)
                    setShowOrcDropdown(true)
                  }}
                  onFocus={() => {
                    if (orcSearchTerm) {
                      setShowOrcDropdown(true)
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium transition-all ${
                    !selectedOrc 
                      ? 'border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-500' 
                      : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-600'
                  }`}
                />
                {selectedOrc && (
                  <button
                    onClick={onClearOrc}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-emerald-200 rounded-full transition-colors"
                  >
                    <X size={18} className="text-emerald-600" strokeWidth={2.5} />
                  </button>
                )}
                {!selectedOrc && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-pulse-soft">
                    <AlertCircle size={18} className="text-red-500" />
                  </div>
                )}

                {/* Dropdown ORC */}
                {showOrcDropdown && filteredOrcList.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-2xl z-40 max-h-60 overflow-y-auto">
                    <div className="sticky top-0 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                        {filteredOrcList.length} result{filteredOrcList.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {filteredOrcList.map((orc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleOrcSelect(orc)
                        }}
                        className={`w-full px-4 py-3 text-left border-b border-slate-100 last:border-0 transition-all hover:bg-blue-50 active:bg-blue-100 ${
                          selectedOrc?.orc === orc.orc ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{orc.orc}</div>
                            <div className="text-xs text-slate-500 mt-1">{orc.style} • {orc.buyer}</div>
                          </div>
                          {selectedOrc?.orc === orc.orc && (
                            <Check size={18} className="text-emerald-600 flex-shrink-0" strokeWidth={3} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-purple-100 rounded">
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span>Style</span>
              </label>
              <div className="px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-sm font-semibold text-slate-900 h-11 flex items-center truncate">
                {selectedOrc?.style || '-'}
              </div>
            </div>

            {/* Buyer */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-amber-100 rounded">
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Buyer</span>
              </label>
              <div className="px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-sm font-semibold text-slate-900 h-11 flex items-center truncate">
                {selectedOrc?.buyer || '-'}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-cyan-100 rounded">
                  <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Date</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, hour: '' })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 transition-all ${
                    !formData.date 
                      ? 'border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-500' 
                      : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-600'
                  }`}
                />
              </div>

              {/* Show used hours */}
              {formData.date && usedHours[formData.date] && usedHours[formData.date].length > 0 && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-lg">
                  <p className="text-xs font-bold text-amber-800">
                    Used: <span className="font-mono">{usedHours[formData.date].sort((a, b) => a - b).join(', ')}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Hour */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <div className="p-1 bg-green-100 rounded">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Hour</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 appearance-none transition-all ${
                    !formData.hour || formData.hour === ''
                      ? 'border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-500'
                      : selectedHourUsed
                      ? 'border-orange-500 bg-orange-50 focus:ring-orange-300 focus:border-orange-500'
                      : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-600'
                  }`}
                  disabled={!formData.date}
                >
                  <option value="" disabled>
                    {!formData.date ? 'Select date first' : 'Select Hour'}
                  </option>
                  {HOURS.map((h) => {
                    const isUsed = isHourUsed(formData.date, parseInt(h))
                    return (
                      <option 
                        key={h} 
                        value={h}
                        disabled={isUsed}
                      >
                        {h}{isUsed ? ' (Used)' : ''}
                      </option>
                    )
                  })}
                </select>
              </div>

              {selectedHourUsed && (
                <div className="mt-2 p-2.5 bg-orange-50 border border-orange-300 rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <p className="text-xs font-bold text-orange-800">
                    Hour {formData.hour} already used
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200">
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !isFormValid}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}