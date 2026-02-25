import { useState, useEffect } from 'react'

import { CATEGORIES,
         CATEGORIES_ES } from '../constants/ice_categories'
import { getReportIcon } from "../constants/ice_icons"
import { useLanguage }   from "../hooks/language"

export default function FilterPanel({ onChange }) {
  const { language } = useLanguage()
  const categories   = language === 'ES' ? CATEGORIES_ES : CATEGORIES

  const [ selected, setSelected   ] = useState(categories.map(c => c.value))
  const [ startDate, setStartDate ] = useState('')
  const [ endDate, setEndDate ]     = useState('')

  // Broadcast whenever selection changes
  useEffect(() => {
    onChange({
      categories: selected,
      startDate,
      endDate
    })
  }, [ selected, startDate, endDate ])

  function toggle(value) {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [ ...prev, value ]
    )
  }

  function selectAll() {
    setSelected(categories.map(c => c.value))
  }

  function clearAll() {
    setSelected([])
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md">

      {/* Report type filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          { language === 'ES' ? 'Filtrar por Tipo' : 'Filter by Incident Type' }
        </h2>
      </div>
      <div className="space-y-2">
        { categories.map(cat => {
          const Icon = getReportIcon(cat.value)

          return (
            <label key={cat.value} className="flex items-center gap-3 text-sm">
              <input type="checkbox"
                     checked={selected.includes(cat.value)}
                     onChange={() => toggle(cat.value)}
              />
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800">
                <Icon size={14} color="white" />
              </span>
              { cat.text }
            </label>
          )
        })}
      </div>

      <button onClick={selectAll} className="text-sm text-blue-600 mr-4">
        { language === 'ES' ? 'Seleccionar todos' : 'Select all' }
      </button>
      <button onClick={clearAll} className="text-sm text-gray-500">
        { language === 'ES' ? 'Limpiar' : 'Clear' }
      </button>

       {/* DATE RANGE FILTER */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          { language === "ES" ? "Filtrar por Fecha" : "Filter by Date" }
        </h2>
        <div className="flex gap-4">
          <div className="flex flex-col text-sm">
            <label>
              { language === "ES" ? "Desde" : "From" }
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col text-sm">
            <label>
              { language === "ES" ? "Hasta" : "To" }
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
