import { useEffect }            from 'react'
import { useMap, useMapEvents } from 'react-leaflet'

// Tracks and updates map bounds
export default function BoundsTracker({ setBounds }) {
  const map = useMap()

  const updateBounds = () => {
    const b    = map.getBounds()
    const bbox = [
      b.getSouth(),
      b.getWest(),
      b.getNorth(),
      b.getEast(),
    ].join(",")

    setBounds(bbox)
  }

  useEffect(() => {
    updateBounds()
  }, [ map ])

  useMapEvents({
    moveend: updateBounds,
  })

  return null
}