import DirectionBadge from "./direction_badge"

export default function CameraDetails({ cam }) {
  return (
    <div>
      <div className="mb-2">
        <strong>{cam.tags?.manufacturer || "Camera"}</strong>
      </div>
      <div className="mb-2">
        Type: {cam.tags?.["camera:type"] || 'n/a'}
      </div>

      <DirectionBadge direction={cam.tags?.direction} />
    </div>
  )
}