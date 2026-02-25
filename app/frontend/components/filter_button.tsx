import { useEffect } from "react"
import { useMap }    from "react-leaflet"
import L             from "leaflet"

export default function FilterButton({ onClick }) {
  const map = useMap()

  useEffect(() => {
    const control = L.control({ position: "bottomright" })

    control.onAdd = () => {
      const div = L.DomUtil.create("div")

      div.innerHTML = `
        <button class="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg text-xl hover:bg-gray-700">
          ☰
        </button>
      `

      L.DomEvent.disableClickPropagation(div)
      div.onclick = onClick

      return div
    }

    control.addTo(map)

    return () => control.remove()
  }, [ map, onClick ])

  return null
}
