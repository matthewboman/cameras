import { MapContainer, TileLayer } from 'react-leaflet'

import BoundsTracker from './bounds_tracker'
import AddButton     from './add_button'

type Props = {
  center:     [ number, number ]
  setBounds:  (b: string) => void
  canAdd:     boolean
  onAddClick: () => void
  children:   React.ReactNode
}

export default function MapBase({
  center,
  setBounds,
  canAdd,
  onAddClick,
  children
}: Props) {
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      <BoundsTracker setBounds={setBounds} />

      { children }

      { canAdd && <AddButton onClick={onAddClick} /> }
    </MapContainer>
  )
}
