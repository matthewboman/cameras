import Map    from '../components/map.tsx'
import Navbar from '../components/navbar.tsx'
import 'leaflet/dist/leaflet.css'

const Home = () => (
  <div className="">
    <Navbar />
    <Map />
  </div>
)

export default Home