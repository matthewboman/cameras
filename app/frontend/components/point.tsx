import { useMapEvents } from 'react-leaflet'

export default function Point({ enabled, onSelect }) {
  useMapEvents({
    click(e) {
      if (!enabled) return

      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    }
  })

  return null
}