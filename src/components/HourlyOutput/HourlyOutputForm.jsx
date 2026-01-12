import { Plus, ChevronRight, AlertCircle, Zap, X } from 'lucide-react'

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

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Button */}
      <button
        onClick={() => onToggleForm(!showForm)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all">
            <Plus size={20} className="text-white" />
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

      {showForm && (
        <div className="p-8 border-t border-gray-200 space-y-8 bg-gradient-to-b from-white to-blue-50">
          
          {/* Progress Indicator */}
          <div className="flex gap-2 items-center">
            {[
              { label: 'ORC', valid: !!selectedOrc },
              { label: 'Date', valid: !!formData.date },
              { label: 'Hour', valid: !!formData.hour && !selectedHourUsed },
              { label: 'Ready', valid: isFormValid }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all ${step.valid ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${step.valid ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {idx < 3 && <span className={`w-6 h-px ${step.valid ? 'bg-emerald-500' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            
            {/* Line - Read Only */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Line</span>
              </label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-sm font-semibold text-gray-900 h-11 flex items-center hover:border-blue-400 transition-colors">
                {formData.line || '-'}
              </div>
            </div>

            {/* ORC Search */}
            <div className="lg:col-span-2 relative">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
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
                    !selectedOrc ? 'border-red-500 bg-red-50 focus:ring-red-300 focus:border-red-500' : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-500'
                  }`}
                />
                {selectedOrc && (
                  <button
                    onClick={onClearOrc}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xl hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                )}
                {!selectedOrc && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold pointer-events-none">
                    !
                  </div>
                )}

                {/* Dropdown ORC */}
                {showOrcDropdown && filteredOrcList.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-2xl z-40 max-h-56 overflow-y-auto">
                    <div className="sticky top-0 px-4 py-2 bg-blue-50 border-b border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">
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
                        className={`w-full px-4 py-3 text-left hover:bg-blue-100 border-b border-gray-100 last:border-0 transition-colors active:bg-blue-200 ${
                          selectedOrc?.orc === orc.orc ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{orc.orc}</div>
                            <div className="text-xs text-gray-500 mt-1">{orc.style} • {orc.buyer}</div>
                          </div>
                          {selectedOrc?.orc === orc.orc && (
                            <span className="text-blue-600 font-bold text-lg">✓</span>
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
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Style</span>
              </label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900 h-11 flex items-center truncate hover:border-blue-400 transition-colors">
                {selectedOrc?.style || '-'}
              </div>
            </div>

            {/* Buyer */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Buyer</span>
              </label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900 h-11 flex items-center truncate hover:border-blue-400 transition-colors">
                {selectedOrc?.buyer || '-'}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Date</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, hour: '' })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 transition-all ${
                    !formData.date ? 'border-red-500 bg-red-50 focus:ring-red-300 focus:border-red-500' : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-500 hover:border-emerald-600'
                  }`}
                />
                {!formData.date && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    !
                  </div>
                )}
              </div>

              {/* Show used hours */}
              {formData.date && usedHours[formData.date] && usedHours[formData.date].length > 0 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800">
                    Used hours: {usedHours[formData.date].sort((a, b) => a - b).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Hour */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Hour</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 appearance-none transition-all ${
                    !formData.hour || formData.hour === ''
                      ? 'border-red-500 bg-red-50 focus:ring-red-300 focus:border-red-500'
                      : selectedHourUsed
                      ? 'border-orange-500 bg-orange-50 focus:ring-orange-300 focus:border-orange-500'
                      : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-500 hover:border-emerald-600'
                  }`}
                  disabled={!formData.date}
                >
                  <option value="" disabled>
                    {!formData.date ? 'Select date first' : 'Select Hour'}
                  </option>
                  {HOURS.map((h) => {
                    const hourNum = parseInt(h)
                    const isUsed = isHourUsed(formData.date, hourNum)
                    
                    return (
                      <option 
                        key={h} 
                        value={h}
                        disabled={isUsed}
                      >
                        {h} {isUsed ? '(Already used)' : ''}
                      </option>
                    )
                  })}
                </select>

                {!formData.hour && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold pointer-events-none">
                    !
                  </div>
                )}
                {selectedHourUsed && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none">
                    <AlertCircle size={20} />
                  </div>
                )}
              </div>

              {selectedHourUsed && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-300 rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-semibold text-orange-800">
                    Hour {formData.hour} already used on {formData.date}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !isFormValid}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
                isFormValid && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}