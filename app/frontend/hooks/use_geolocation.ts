import { useEffect, useState } from 'react'

const DEFAULT_CENTER = [ 35.5975, -82.5461 ]

export default function useGeolocation() {
  const [ center, setCenter ] = useState(DEFAULT_CENTER)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      pos => { setCenter([pos.coords.latitude, pos.coords.longitude]) },
      () => setCenter(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  return center
}
