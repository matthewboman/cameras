import { useState } from 'react'

import AddEntityModal from '../components/add_entity'
import CameraDetails  from '../components/camera_details'
import FilterButton   from '../components/filter_button'
import FilterPanel    from '../components/filter_panel'
import IceForm        from '../components/ice_form'
import IceIcon        from '../components/ice_icon'
import MapBase        from '../components/map_base'
import NewCamera      from '../components/new_camera'

import useCameraData  from '../hooks/use_camera_data'
import useGeolocation from '../hooks/use_geolocation'
import useIceData     from '../hooks/use_ice_data'

type Props = {
  userId:          number
  isDataCollector: boolean
  isIceVerified:   boolean
}

export default function Main({
  userId,
  isDataCollector,
  isIceVerified
}: Props) {
  const center = useGeolocation()

  const [ bounds, setBounds ]           = useState<string | null>(null)
  const [ filters, setFilters ]         = useState({
    categories: [] as string[],
    startDate: '',
    endDate: ''
  })
  const [ formType, setFormType ]       = useState<'ice' | 'camera' | null>(null)
  const [ refreshKey, setRefreshKey ]   = useState(0)
  const [ showAdd, setShowAdd ]         = useState(false)
  const [ showFilters, setShowFilters ] = useState(false)

  const iceData    = useIceData(bounds, filters, refreshKey)
  const cameraData = useCameraData(bounds, refreshKey)
  const canAdd     = isDataCollector || isIceVerified

return (
  <div className="relative h-full w-full">
    <MapBase
      center={center}
      setBounds={setBounds}
      canAdd={canAdd}
      onAddClick={() => setShowAdd(true)}
    >
      { cameraData.map(cam => (
        <CameraDetails key={cam.id} cam={cam} />
      ))}

      { iceData.map(i => (
        <IceIcon key={i.id} data={i} />
      ))}

      <FilterButton onClick={() => setShowFilters(true)} />

      {/* AddEntityModal MUST stay mounted */}
      <AddEntityModal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false)
          setFormType(null)
        }}
        renderForms={({ position, address, reset }) => (
          <>
            { !formType && (
              <select
                className="w-full rounded-md border px-2 py-1 text-sm"
                defaultValue=""
                onChange={(e) =>
                  setFormType(e.target.value as 'ice' | 'camera')
                }
              >
                <option value="" disabled>(choose)</option>
                <option value="ice">ICE info</option>
                <option value="camera">Cameras</option>
              </select>
            )}

            { formType === 'ice' && (
              <IceForm
                position={position}
                address={address}
                userId={userId}
                onSubmit={() => {
                  reset()
                  setFormType(null)
                  setRefreshKey(k => k + 1)
                }}
              />
            )}

            { formType === 'camera' && (
              <NewCamera
                position={position}
                userId={userId}
                onSubmit={() => {
                  reset()
                  setFormType(null)
                  setRefreshKey(k => k + 1)
                }}
              />
            )}
          </>
        )}
      />
    </MapBase>

    { showFilters && (
      <div className="absolute bottom-24 right-4 z-[2000]">
        <div className="relative bg-white rounded-xl shadow-xl p-4 w-[420px]">
          <button onClick={() => setShowFilters(false)} className="absolute top-2 right-3 text-gray-500 text-lg">
            x
          </button>
          <FilterPanel onChange={setFilters} />
        </div>
      </div>
    )}
  </div>
)}
