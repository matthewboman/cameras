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

export const REPORT_TYPE_ICON_COMPONENTS = {
  checkpoint:       Shield,
  community_arrest: Users,
  court_arrest:     Gavel,
  traffic_stop:     Car,
  home_visit:       House,
  workplace:        Building2,
  jail_arrest:      Columns4,
  ice_stakeout:     Eye,
  ice_staging:      Truck,
  border_patrol:    Ghost,
  observer_report:  ScanEye,
  other:            MapPin
}

export function getReportIcon(type) {
  return REPORT_TYPE_ICON_COMPONENTS[type] || Circle
}
