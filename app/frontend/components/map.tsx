import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  MapContainer,
  TileLayer
} from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

import AddButton     from './add_button'
import AddressSearch from './address_search'
import BoundsTracker from './bounds_tracker'
import CameraDetails from './camera_details'
import IceIcon       from './ice_icon'
import IceForm       from './ice_form'
import NewCamera     from './new_camera'
import Point         from './point'

// Asheville
const DEFAULT_CENTER = [ 35.5975, -82.5461 ]

export default function Map({
  isAdmin,
  isDataCollector,
  isIceVerified,
  userId,
  datasets = [],
  iceOnly
}) {
  const [ addMode, setAddMode ]         = useState(null)
  const [ address, setAddress ]         = useState(null)
  const [ bounds, setBounds ]           = useState(null)
  const [ center, setCenter ]           = useState(DEFAULT_CENTER)
  const [ formType, setFormType ]       = useState(null)
  const [ iceData, setIceData ]         = useState([])
  const [ osmCameras, setOsmCameras ]   = useState([])
  const [ position, setPosition ]       = useState(null)
  const [ showAddMenu, setShowAddMenu ] = useState(false)
  const [ showAddress, setShowAddress ] = useState(false)

  // Makes GET request to load security cameras
  const loadCameras = useCallback((bounds) => {
    if (!bounds) return

    axios.get(`/api/open-street-map-cameras?bbox=${bounds}`).then((res) => {
      const cameras = res?.data?.cameras || []
      setOsmCameras(cameras)
    })
  }, [])

  // Makes GET request to load ICE activity
  const loadIce = useCallback((bounds) => {
    if (!bounds) return

    axios.get(`/api/ice-activity?bbox=${bounds}`).then((res) => {
      const ice = res?.data?.ice || []

      setIceData(ice)
    })
  }, [])

  // Key/value pair of available datasets && functions to call
  const registry = useMemo(() => ({
    cameras: loadCameras,
    ice:     loadIce
  }), [ loadCameras, loadIce ])

  // Load data on mount
  useEffect(() => {
    datasets.forEach((key) => {
      const fn = registry[key]

      if (typeof fn === 'function') fn(bounds)
    })
  }, [ datasets, bounds, registry ])

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

  // Handle settings specific to ICE map
  useEffect(() => {
    setFormType('ice')
  }, iceOnly)

  // Clear state once user has submitted
  const resetFlow = () => {
    setAddMode(null)
    setShowAddMenu(false)
    setShowAddress(false)
    setPosition(null)

    if (iceOnly) {
      setFormType('ice')
    } else {
      setFormType(null)
    }
  }

  // Whether a user can add data
  const canAdd = () => {
    return isDataCollector || isIceVerified
  }

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <BoundsTracker setBounds={setBounds} />

      {/* Datasets */}
      { osmCameras.map((cam) => <CameraDetails cam={cam} />) }
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
            {!formType && (
              <label className="block mb-2">
                <span className="text-sm">Select what you'd like to submit</span>
                <select
                  className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                  value={formType ?? ''}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  <option value="" disabled>(choose)</option>
                  <option value="ice">ICE info</option>
                  <option value="camera">Cameras</option>
                  {/* <option value="other">other</option> */}
                </select>
              </label>
            )}

            { formType === 'ice' && (
              <IceForm address={address} position={position} userId={userId} onSubmit={resetFlow} />
            )}

            { formType === 'camera' && (
              <NewCamera position={position} userId={userId} onSubmit={resetFlow} />
            )}

            <button className="mt-4 rounded-md border px-3 py-1 text-sm" onClick={resetFlow}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Use map or address to set location */}
      { showAddMenu && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-md shadow-lg p-4 w-64">
            <select
              className="w-full rounded-md border px-2 py-1 text-sm"
              defaultValue=""
              onChange={(e) => {
                setShowAddMenu(false)
                if (e.target.value === 'map') setAddMode('map')
                if (e.target.value === 'address') setShowAddress(true)
              }}
            >
              <option value="" disabled>(choose)</option>
              <option value="map">Add from map</option>
              <option value="address">Add with address</option>
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
              Cancel
            </button>
          </div>
        </div>
      )}

      { canAdd && <AddButton onClick={() => setShowAddMenu(true)} /> }

    </MapContainer>
  )
}
