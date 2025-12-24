import { Plus, ChevronRight } from 'lucide-react'

const HOURS = Array.from({ length: 8 }, (_, i) => String(i + 1))

export default function HourlyOutputForm({
  showForm,
  onToggleForm,
  formData,
  setFormData,
  selectedOrc,
  orcSearchTerm,
  setOrcSearchTerm,
  showOrcDropdown,
  setShowOrcDropdown,
  filteredOrcList,
  onOrcSelect,
  onClearOrc,
  onSubmit,
  onCancel,
  loading
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <button
        onClick={() => onToggleForm(!showForm)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-200 border-b-2 border-blue-500"
      >
        <div className="flex items-center gap-3">
          <Plus size={22} className="text-white" />
          <span className="font-bold text-white text-lg tracking-wide">Add New Output</span>
        </div>
        <ChevronRight
          size={22}
          className={`text-white transition-transform duration-300 ${showForm ? 'rotate-90' : ''}`}
        />
      </button>

      {showForm && (
        <div className="p-8 border-t border-gray-200 space-y-8 bg-gradient-to-b from-white to-blue-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Line */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Line</label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-sm font-semibold text-gray-900 h-11 flex items-center hover:border-blue-400 transition-colors">
                {formData.line || '-'}
              </div>
            </div>

            {/* ORC Search */}
            <div className="lg:col-span-2 relative z-20 md:z-30">
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">ORC <span className="text-red-500">*</span></label>
              <div onBlur={() => setTimeout(() => setShowOrcDropdown(false), 200)}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search ORC..."
                    value={orcSearchTerm}
                    onChange={(e) => {
                      setOrcSearchTerm(e.target.value)
                      setShowOrcDropdown(true)
                    }}
                    onFocus={() => setShowOrcDropdown(true)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
                  />
                  {selectedOrc && (
                    <button onClick={onClearOrc} className="text-gray-400 hover:text-gray-600 font-bold text-xl">
                      ×
                    </button>
                  )}
                </div>

                {showOrcDropdown && filteredOrcList.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto">
                    {filteredOrcList.map((orc, idx) => (
                      <button
                        key={idx}
                        onClick={() => onOrcSelect(orc)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 text-sm">{orc.orc}</div>
                        <div className="text-xs text-gray-500 mt-1">{orc.style} • {orc.buyer}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Style</label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900 h-11 flex items-center truncate hover:border-blue-400 transition-colors">
                {selectedOrc?.style || '-'}
              </div>
            </div>

            {/* Buyer */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Buyer</label>
              <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900 h-11 flex items-center truncate hover:border-blue-400 transition-colors">
                {selectedOrc?.buyer || '-'}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium h-11 hover:border-blue-400 transition-all"
              />
            </div>

            {/* Hour */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Hour <span className="text-red-500">*</span></label>
              <select
                value={formData.hour}
                onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium h-11 hover:border-blue-400 transition-all"
              >
                <option value="">Select</option>
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
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
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}