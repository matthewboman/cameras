import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useCameraData(bounds, refreshKey) {
  const [ cameraData, setCameraData ] = useState([])

  useEffect(() => {
    if (!bounds) return

    axios.get(`/api/open-street-map-cameras?bbox=${bounds}`)
         .then(res => setCameraData(res?.data?.cameras || []))
  }, [ bounds, refreshKey ])

  return cameraData
}
