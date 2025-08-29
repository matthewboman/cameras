
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

import CameraDetails from './camera_details'
import NewCamera     from './new_camera'

// Updates map coordinates
function BoundsTracker({ setBounds }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target
      const b   = map.getBounds()

      const bbox = [
        b.getSouth(),
        b.getWest(),
        b.getNorth(),
        b.getEast(),
      ].join(",")

      setBounds(bbox)
    },
  })

  return null
}

export default function Map() {
  // TODO: set user's location as default
  const position                      = [35.5975, -82.5461]
  const [ osmCameras, setOsmCameras ] = useState([])
  const [ bounds, setBounds ]         = useState(null)

  // Load cameras on mount
  // TODO: doesn't seem to be working
  useEffect(() => {
    loadCameras(bounds)
  }, [])

  // Reload cameras when bounds change
  useEffect(() => {
    loadCameras(bounds)
  }, [bounds])

  // Makes GET request to load security cameras
  const loadCameras = (bounds) => {
    if (!bounds) return

    axios.get(`/api/open-street-map-cameras?bbox=${bounds}`).then((res) => {
      console.log(res)
      setOsmCameras(res.data.cameras)
    })
  }

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <BoundsTracker setBounds={setBounds} />

      {osmCameras.map((cam) => (
        <Marker key={cam.id} position={[cam.lat, cam.lon]}>
          <Popup>
            <CameraDetails cam={cam} />
          </Popup>
        </Marker>
      ))}

      <NewCamera />
    </MapContainer>
  )
}
