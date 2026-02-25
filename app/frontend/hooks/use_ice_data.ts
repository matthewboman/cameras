import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useIceData(bounds, filters, refreshKey) {
  const [ iceData, setIceData ] = useState([])

  useEffect(() => {
    if (!bounds) return

    const params = new URLSearchParams({ bbox: bounds })

    if (filters?.categories?.length)
      params.append('categories', filters.categories.join(','))

    if (filters?.startDate)
      params.append('start_date', filters.startDate)

    if (filters?.endDate)
      params.append('end_date', filters.endDate)

    axios.get(`/api/ice-activity?${params}`)
         .then(res => setIceData(res?.data?.ice || []))
  }, [ bounds, filters, refreshKey ])

  return iceData
}
