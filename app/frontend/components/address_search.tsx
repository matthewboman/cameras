import { useEffect, useState } from "react"

const DEBOUNCE = 400 // ms

export default function AddressSearch({ onSelect }) {
  const [ loading, setLoading ] = useState(false)
  const [ query, setQuery ]     = useState("")
  const [ results, setResults ] = useState([])

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      const data = await res.json()

      setResults(data)
      setLoading(false)
    }, DEBOUNCE)

    return () => clearTimeout(timeout)
  }, [ query ])

  return (
    <div className="relative">
      <input
        className="w-full rounded-md border px-2 py-1 text-sm"
        placeholder="Enter address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      { loading && (
        <div className="absolute right-2 top-2 text-xs text-gray-400">
          loading…
        </div>
      )}

      { results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow">
          { results.map((r) => (
            <li
              key={r.place_id}
              className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-100"
              onClick={() => {
                onSelect({
                  lat:     Number(r.lat),
                  lng:     Number(r.lon),
                  address: r.display_name,
                })
                setQuery(r.display_name)
                setResults([])
              }}
            >
              { r.display_name }
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
