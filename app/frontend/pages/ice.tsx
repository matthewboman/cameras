import { useEffect, useState }     from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import axios                       from 'axios'
import 'leaflet/dist/leaflet.css'

import AddButton       from '../components/add_button'
import AddressSearch   from '../components/address_search'
import BoundsTracker   from '../components/bounds_tracker'
import IceIcon         from '../components/ice_icon'
import IceForm         from '../components/ice_form'
import Point           from '../components/point'
import { useLanguage } from "../hooks/language"

// Asheville
const DEFAULT_CENTER = [ 35.5975, -82.5461 ]

export default function Ice({
  isAdmin,
  isIceVerified,
  userId
}) {
  const [ addMode, setAddMode ]         = useState(null)
  const [ address, setAddress ]         = useState(null)
  const [ bounds, setBounds ]           = useState(null)
  const [ center, setCenter ]           = useState(DEFAULT_CENTER)
  const [ iceData, setIceData ]         = useState([])
  const [ position, setPosition ]       = useState(null)
  const [ refreshKey, setRefreshKey ]   = useState(0)
  const [ showAddMenu, setShowAddMenu ] = useState(false)
  const [ showAddress, setShowAddress ] = useState(false)

  const { language } = useLanguage()

  // Whether a user can add data
  const canAdd = () => {
    return isIceVerified
  }

  // Makes GET request to load ICE activity
  const loadIce = (bounds) => {
    if (!bounds) return

    axios.get(`/api/ice-activity?bbox=${bounds}`).then((res) => {
      const ice = res?.data?.ice || []

      setIceData(ice)
    })
  }

  // Clear state once user has submitted
  const resetFlow = () => {
    setAddMode(null)
    setShowAddMenu(false)
    setShowAddress(false)
    setPosition(null)
    setRefreshKey(k => k + 1)
  }

  // Load data on mount
  useEffect(() => {
    loadIce(bounds)
  }, [ bounds, refreshKey ])

  // Set map center to user's location
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter([pos.coords.latitude, pos.coords.longitude])
    }, () => {
      setCenter(DEFAULT_CENTER)
    },
    { enableHighAccuracy: true, timeout: 5000 }
  )}, [])

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <BoundsTracker setBounds={setBounds} />

      {/* Datasets */}
      { iceData.map(i => <IceIcon data={i} />) }

      {/* Adding data */}
      <Point
        enabled={addMode === 'map'}
        onSelect={(pos) => {
          setPosition(pos)
          setAddMode(null)
        }}
      />

      { position && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-md shadow-lg p-6 w-[400px]">
            <IceForm address={address} position={position} userId={userId} onSubmit={resetFlow} />
            <button className="mt-4 rounded-md border px-3 py-1 text-sm" onClick={resetFlow}>
              { language == 'ES' ? 'Cancelar' : 'Cancel' }
            </button>
          </div>
        </div>
      )}

      {/* Use map or address to set location */}
      { showAddMenu && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-md shadow-lg p-4 w-64">
            <div className="mb-2 text-sm">
              { language == 'ES' ? '¿Cómo desea agregar la información?' : 'How would you like to add information?' }
            </div>
            <select
              className="w-full rounded-md border px-2 py-1 text-sm"
              defaultValue=""
              onChange={(e) => {
                setShowAddMenu(false)
                if (e.target.value === 'map') setAddMode('map')
                if (e.target.value === 'address') setShowAddress(true)
              }}
            >
              <option value="" disabled>
                { language == 'ES' ? '(seleccione)' : '(choose)' }
              </option>
              <option value="map">
                { language == 'ES' ? 'Agregar desde el mapa' : 'Add from map' }
              </option>
              <option value="address">
                { language == 'ES' ? 'Agregar desde una dirección' : 'Add with address' }
              </option>
            </select>
          </div>
        </div>
      )}

      {/* Address search popup */}
      { showAddress && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-md shadow-lg p-6 w-[400px]">
            <AddressSearch
              onSelect={({ lat, lng, address }) => {
                setPosition({ lat, lng })
                setAddress(address)
                setShowAddress(false)
              }}
            />
            <button className="mt-4 rounded-md border px-3 py-1 text-sm" onClick={resetFlow}>
              { language == 'ES' ? 'Cancelar' : 'Cancel' }
            </button>
          </div>
        </div>
      )}

      { position && <IceForm address={address} position={position} userId={userId} onSubmit={resetFlow} /> }
      { canAdd && <AddButton onClick={() => setShowAddMenu(true)} /> }
    </MapContainer>
  )
}

