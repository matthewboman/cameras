import { createRoot }    from "react-dom/client"
import L                 from 'leaflet'
import moment            from "moment"
import { Marker, Popup } from 'react-leaflet'
import {
  Building2,
  Car,
  Circle,
  Columns4,
  Eye,
  Gavel,
  Ghost,
  House,
  MapPin,
  ScanEye,
  Shield,
  Truck,
  Users
} from "lucide-react"

// Build icon based on type of incident and recency
export default function IceIcon({ data }) {
  const REPORT_TYPE_ICONS = {
    checkpoint:       <Shield color="white"/>,
    community_arrest: <Users color="white" />,
    court_arrest:     <Gavel color="white" />,
    traffic_stop:     <Car color="white" />,
    home_visit:       <House color="white" />,
    workplace:        <Building2 color="white" />,
    jail_arrest:      <Columns4 color="white" />,
    ice_stakeout:     <Eye color="white" />,
    ice_staging:      <Truck color="white" />,
    border_patrol:    <Ghost color="white" />,
    observer_report:  <ScanEye color="white" />,
    other:            <MapPin color="white" />
  }

  // Turns underscore to text
  const formatReportType = str => str
    .split("_")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")

  // Set color based on time
  const color = datetime => {
    const now = moment()
    const t   = moment(datetime)

    if (now.diff(t, "hours") < 2) return "bg-red-600"
    if (now.isSame(t, "day"))     return "bg-yellow-500"

    return "bg-green-600"
  }

  // Set icon based on report type
  const iconType = reportType => {
    return REPORT_TYPE_ICONS[reportType] || <Circle color="white" />
  }

  // TODO: React seems unhappy with this dynamic approach
  // Create icon
  const createIcon = (data) => {
    const el = document.createElement("div")
    el.className = `
      w-8 h-8 flex items-center justify-center
      rounded-full border-2 border-white shadow-lg
      ${color(data.spotted_at)}
    `
    createRoot(el).render(iconType(data.report_type))

    return L.divIcon({
      className:  "bg-transparent",
      html:       el,
      iconSize:   [ 24, 24 ],
      iconAnchor: [ 12, 12 ],
    })
  }

  return (
    <Marker key={data.id} position={[data.lat, data.lon]} icon={createIcon(data)}>
      <Popup>
        <div className="mb-2">
          <h5 className="text-lg">
            { data.title }
          </h5>
          <div className="text-xs">
            { formatReportType(data.report_type || '') }
          </div>
        </div>
        <div className="text-sm mb-2">
            { data.body }
        </div>
        <div>
          <div className="text-sm">
            { moment(data.spotted_at).format("dddd, MMMM D - h:mm A") }
          </div>
        </div>
      </Popup>
    </Marker>
  )
}