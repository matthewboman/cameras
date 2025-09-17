import { useEffect, useMemo, useState } from 'react'
import { Popup, useMapEvents } from 'react-leaflet'
import L, { LatLng }           from "leaflet"
import axios                   from 'axios'


export default function NewCamera() {
  const [ position, setPosition ]   = useState<LatLng | null>(null)
  const [ isLoading, setIsLoading ] = useState(false)

  const [ cameraType, setCameraType ]     = useState("")
  const [ cameraMount, setCameraMount ]   = useState("")
  const [ description, setDescription ]   = useState("")
  const [ manufacturer, setManufacturer ] = useState("")
  const [ name, setName ]                 = useState("")
  const [ surveillance, setSurveillance ] = useState("")

  // Set Map position on click/touch
  useMapEvents({
    click(e) {
      setPosition(L.latLng(e.latlng.lat, e.latlng.lng))
    },
    tap(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  })

  // Prevent re-render on state update
  const lat = position?.lat
  const lng = position?.lng

  const popupPosition = useMemo<[number, number] | null>(
    () => (lat != null && lng != null ? [lat, lng] : null),
    [lat, lng]
  )

  useEffect(() => {
    if (lat == null || lng == null) return

    setSurveillance("")
    setCameraType("")
    setCameraMount("")
    setName("")
    setDescription("")
    setManufacturer("")
  }, [lat, lng])

  if (!popupPosition) return null

  // Makes POST request to process new camera
  const submitCamera = () => {
    setIsLoading(true)

    const camera_details = {
      // "camera:direction": 0, // TODO
      "camera:mount":     cameraMount  || undefined,
      "camera:type":      cameraType   || undefined,
      "description":      description  || undefined,
      "manufacturer":     manufacturer || undefined,
      "name":             name         || undefined,
      "surveillance":     surveillance || undefined,
      "lat":              position.lat,
      "lon":              position.lng
    }

    axios.post("/api/add-open-street-map-camera", { camera_details }, { withCredentials: true } )
      .then(res => {
        console.log('res')
        setPosition(null)
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
        setIsLoading(false)
      })
}

  return (
    <Popup
      key="create-camera-popup"
      className="min-w-[400px]"
      position={popupPosition}
      eventHandlers={{ remove: () => setPosition(null) }}
    >
      <div>
        <label className="block mb-2">
          <span className="text-sm">surveillance area</span>
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={surveillance}
            onChange={(e) => setSurveillance(e.target.value)}
            title="What kind of area is monitored"
          >
            <option value="public">public</option>
            <option value="indoor">indoor</option>
            <option value="outdoor">outdoor</option>
            <option value="traffic">traffic</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-sm">camera:type</span>
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            title="Style of camera"
          >
            <option value="">(choose)</option>
            <option value="fixed">fixed</option>
            <option value="panning">panning</option>
            <option value="dome">dome</option>
            <option value="alpr">alpr</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-sm">manufacturer</span>
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            title="Camera manufacturer"
          >
            <option value="">(choose)</option>
            <option value="Amazon">Amazon</option>
            <option value="Flock Safety">Flock Safety</option>
            <option value="">unknown</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-sm">camera:mount</span>
          <input
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={cameraMount}
            onChange={(e) => setCameraMount(e.target.value)}
            title="Where the camera is mounted"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">name</span>
          <input
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            title="Human-readable name"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">description</span>
          <textarea
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            title="What it monitors"
          />
        </label>

        {/* TODO: set direction */}

        <button
          disabled={isLoading}
          type="button"
          onClick={submitCamera}
          className="rounded-md border px-3 py-1 text-sm hover:cursor-pointer"
        >
          {isLoading ? "Loading…" : "Submit"}
        </button>

      </div>
    </Popup>
  )
}