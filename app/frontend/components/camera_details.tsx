import { Marker, Popup } from 'react-leaflet'

import DirectionBadge from "./direction_badge"

export default function CameraDetails({ cam }) {
  return (
    <Marker key={cam.id} position={[cam.lat, cam.lon]}>
      <Popup>
        <div>
          <div className="mb-2">
            <strong>{cam.tags?.manufacturer || "Camera"}</strong>
          </div>

          {cam.tags?.["camera:type"] && (
            <div className="mb-2">
              type: {cam.tags["camera:type"]}
            </div>
          )}
          {cam.tags?.["surveillance:type"] && (
            <div className="mb-1">
              surveillance type: {cam.tags?.["surveillance:type"]}
            </div>
          )}
          {cam.tags?.["camera:mount"] && (
            <div className="mb-1">
              camera mount: {cam.tags?.["camera:mount"]}
            </div>
          )}
          {cam.tags?.["name"] && (
            <div className="mb-1">
              name: {cam.tags?.["name"]}
            </div>
          )}
          {cam.tags?.["description"] && (
            <div className="mb-1">
              description: {cam.tags?.["description"]}
            </div>
          )}
          <DirectionBadge direction={cam.tags?.direction} />
        </div>
      </Popup>
    </Marker>
  )
}