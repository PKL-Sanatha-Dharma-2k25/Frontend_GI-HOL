import { Plus, ChevronRight, AlertCircle, Check, X, Clock } from 'lucide-react'

export default function HourlyOutputForm({
  showForm = true,
  onToggleForm = () => { },
  formData = { line: '', date: '', hour: '' },
  setFormData = () => { },
  selectedOrc = null,
  orcSearchTerm = '',
  setOrcSearchTerm = () => { },
  showOrcDropdown = false,
  setShowOrcDropdown = () => { },
  filteredOrcList = [],
  onOrcSelect = () => { },
  onClearOrc = () => { },
  onSubmit = () => { },
  onCancel = () => { },
  loading = false,
  isHourUsed = () => false,
  usedHours = {},
  hourOptions = [],
  hourLoading = false,
}) {
  const selectedHourUsed = formData.hour && isHourUsed(formData.date, formData.hour)

  const isFormValid =
    formData.date &&
    formData.date.trim() !== '' &&
    formData.hour &&
    formData.hour.trim() !== '' &&
    selectedOrc &&
    !selectedHourUsed

  const usedHoursForDate = formData.date && usedHours[formData.date]
    ? usedHours[formData.date]
    : []

  const handleOrcSelect = (orc) => {
    onOrcSelect(orc)
    setOrcSearchTerm(orc.orc)
    setShowOrcDropdown(false)
  }

  const getSelectedHourInfo = () => {
    if (!formData.hour) return 'Select Hour'
    const selected = hourOptions.find(h => String(h.value) === String(formData.hour))
    return selected ? selected.label : formData.hour
  }

  const getFormattedUsedHours = () => {
    if (!Array.isArray(usedHoursForDate) || usedHoursForDate.length === 0) return []
    return usedHoursForDate.map(hourId => {
      const hourOption = hourOptions.find(h => String(h.value) === String(hourId))
      return hourOption ? hourOption.label.split('(')[0].trim() : `H-${hourId}`
    })
  }

  const formSteps = [
    { label: 'ORC', valid: !!selectedOrc },
    { label: 'Date', valid: !!formData.date },
    { label: 'Hour', valid: !!formData.hour && !selectedHourUsed },
    { label: 'Ready', valid: isFormValid }
  ]

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      <style>{`
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1500px; opacity: 1; }
        }
        .form-content { animation: ${showForm ? 'slideDown 0.4s ease-out' : 'none'}; overflow: hidden; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-pulse-soft { animation: pulse 2s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-soft { animation: spin 1s linear infinite; }
      `}</style>

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
        <ChevronRight size={22} className={`text-white transition-transform duration-300 flex-shrink-0 ${showForm ? 'rotate-90' : ''}`} />
      </button>

      <div className="form-content">
        <div className="p-8 border-t border-slate-200 space-y-8 bg-gradient-to-b from-white to-blue-50/50">

          <div className="flex gap-2 items-center flex-wrap">
            {formSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-all ${step.valid ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                  {step.valid && idx < 3 ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${step.valid ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                  {step.label}
                </span>
                {idx < 3 && <span className={`w-8 h-0.5 mx-1 transition-all ${step.valid ? 'bg-emerald-500' : 'bg-slate-300'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Line</label>
              <div className="px-4 py-3 border-2 border-blue-300 rounded-lg bg-blue-50 text-sm font-semibold text-slate-900 h-11 flex items-center">{formData.line || '-'}</div>
            </div>

            <div className="lg:col-span-2 relative">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">ORC <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ORC..."
                  value={orcSearchTerm}
                  onChange={(e) => { setOrcSearchTerm(e.target.value); setShowOrcDropdown(true); }}
                  onFocus={() => { if (orcSearchTerm) setShowOrcDropdown(true); }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium transition-all ${!selectedOrc ? 'border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-500' : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 focus:border-emerald-600'
                    }`}
                />
                {selectedOrc && (
                  <button onClick={onClearOrc} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-emerald-200 rounded-full">
                    <X size={18} className="text-emerald-600" strokeWidth={2.5} />
                  </button>
                )}
                {showOrcDropdown && filteredOrcList.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl z-40 max-h-60 overflow-y-auto">
                    {filteredOrcList.map((orc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); handleOrcSelect(orc); }}
                        className={`w-full px-4 py-3 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 ${selectedOrc?.orc === orc.orc ? 'bg-emerald-50' : ''}`}
                      >
                        <div className="font-bold text-slate-900 text-sm">{orc.orc}</div>
                        <div className="text-xs text-slate-500 mt-1">{orc.style} • {orc.buyer}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Style</label>
              <div className="px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-sm font-semibold text-slate-900 h-11 flex items-center truncate">{selectedOrc?.style || '-'}</div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Buyer</label>
              <div className="px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-sm font-semibold text-slate-900 h-11 flex items-center truncate">{selectedOrc?.buyer || '-'}</div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, hour: '' })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 transition-all ${!formData.date ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200'
                  }`}
              />
              {formData.date && getFormattedUsedHours().length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {getFormattedUsedHours().map((h, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">{h}</span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Hour <span className="text-red-500">*</span></label>
              {hourLoading ? (
                <div className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 h-11 flex items-center justify-center"><div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin-soft"></div></div>
              ) : (
                <select
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm font-medium h-11 appearance-none transition-all ${!formData.hour || formData.hour === '' ? 'border-red-400 bg-red-50' : selectedHourUsed ? 'border-orange-500 bg-orange-50' : 'border-emerald-500 bg-emerald-50'
                    }`}
                  disabled={!formData.date || hourOptions.length === 0}
                >
                  <option value="" disabled>{!formData.date ? 'Select date' : 'Select Hour'}</option>
                  {hourOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={usedHoursForDate.includes(opt.value)}>{opt.label}{usedHoursForDate.includes(opt.value) ? ' (Used)' : ''}</option>
                  ))}
                </select>
              )}
              {selectedHourUsed && <p className="mt-2 text-[10px] font-bold text-orange-600">{getSelectedHourInfo()} is already used on this date</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button onClick={onCancel} className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all">Cancel</button>
            <button
              onClick={onSubmit}
              disabled={loading || !isFormValid}
              className={`px-8 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isFormValid && !loading ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-soft"></div> : <Check size={18} strokeWidth={2.5} />}
              {loading ? 'Saving...' : 'Save Output'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}