import Map from '../components/map.tsx'
import 'leaflet/dist/leaflet.css'

// TODO: ICE map should only track/handle ICE related things
// TODO: Remove camera-add
const Ice = ({ userId }) => (
  <div className="">
    <Map userId={userId} datasets={['ice']}/>
  </div>
)

export default Ice