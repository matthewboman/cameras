import { useEffect, useState } from 'react'

import AddressSearch from './address_search'
import Point         from './point'

import { useLanguage } from "../hooks/language"

type Position = { lat: number; lng: number }

type Props = {
  isOpen:      boolean
  onClose:     () => void
  renderForms: (args: {
    position: Position
    address:  string | null
    reset:    () => void
  }) => React.ReactNode
}

export default function AddEntityModal({
  isOpen,
  onClose,
  renderForms
}: Props) {
  const [ address, setAddress ]         = useState<string | null>(null)
  const [ overlayOpen, setOverlayOpen ] = useState(false)
  const [ mode, setMode ]               = useState<'map' | 'address' | null>(null)
  const [ position, setPosition ]       = useState<Position | null>(null)

  const { language } = useLanguage()

  // Keep component mounted; only control overlay visibility
  useEffect(() => {
    if (isOpen) {
      setOverlayOpen(true)
    }
  }, [ isOpen ])

  function reset() {
    setMode(null)
    setPosition(null)
    setAddress(null)
    setOverlayOpen(false)
    onClose()
  }

  function handleSourceChange(value: string) {
    if (value === 'map') {
      setMode('map')
      setOverlayOpen(false)
      return
    }

    if (value === 'address') {
      setMode('address')
    }
  }

  function handleMapSelect(pos: Position) {
    setPosition(pos)
    setMode(null)
    setOverlayOpen(true)
  }

  return (
    <>
      {/* Map click handler always mounted */}
      <Point
        enabled={mode === 'map'}
        onSelect={handleMapSelect}
      />

      {/* Overlay */}
      { overlayOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-md shadow-lg p-6 w-[400px]">
            <div>
              { language == 'ES' ? '¿Cómo quieres agregar la información?' : 'How do you want to add the information?' }
            </div>
            { !mode && !position && (
              <select
                className="w-full rounded-md border px-2 py-1 text-sm"
                defaultValue=""
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                <option value="" disabled>
                  { language == 'ES' ? '(elegir)' : '(choose)'}
                </option>
                <option value="map">
                  { language == 'ES' ? 'Agregar desde el mapa' : 'Add from map' }
                </option>
                <option value="address">
                  { language == 'ES' ? 'Agregar desde la dirección' : 'Add with address' }
                </option>
              </select>
            )}

            { mode === 'address' && (
              <AddressSearch
                onSelect={({ lat, lng, address }) => {
                  setPosition({ lat, lng })
                  setAddress(address)
                  setMode(null)
                  setOverlayOpen(true)
                }}
              />
            )}

            { position && renderForms({ position, address, reset }) }

            <button className="mt-4 rounded-md border px-3 py-1 text-sm" onClick={reset}>
              { language == 'ES' ? 'Cancelar' : 'Cancel' }
            </button>

          </div>
        </div>
      )}
    </>
  )
}
