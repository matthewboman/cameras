import { useEffect } from "react"
import { useMap }    from "react-leaflet"
import L             from "leaflet"

export default function AddButton({ onClick }) {
  const map = useMap()

  useEffect(() => {
    const control = L.control({ position: "bottomright" })

    control.onAdd = () => {
      const div = L.DomUtil.create("div")
      div.innerHTML = `
        <button
          class="w-12 h-12 rounded-full bg-blue-600 text-white
                 flex items-center justify-center shadow-lg
                 text-2xl hover:bg-blue-700">
          +
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
