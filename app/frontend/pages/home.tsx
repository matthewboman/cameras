import Map from '../components/map.tsx'
import 'leaflet/dist/leaflet.css'

const Home = ({ userId }) => (
  <div className="">
    <Map userId={userId} datasets={['cameras', 'ice']}/>
  </div>
)

export default Home