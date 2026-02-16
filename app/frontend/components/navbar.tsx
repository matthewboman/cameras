import { useState }    from "react"
import { useLanguage } from "../hooks/language"

export default function Navbar({ isDataCollector, userId }) {
  const [ open, setOpen ]            = useState(false)
  const { language, toggleLanguage } = useLanguage()

  return (
    <>
      <nav className="h-12 bg-white/90 backdrop-blur border-b flex items-center justify-end px-4 z-[2002] mb-2">

        <span className="pr-2">
          { language == 'ES' ? 'Idioma' : 'Language:' }
        </span>
        <button onClick={toggleLanguage} className="pr-3 hover:bg-gray-100 text-sm font-medium">
          { language }
        </button>

        <button
          onClick={() => setOpen(v => !v)}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="menu"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {open && (
        <>
          <div className="fixed inset-0 z-[2000]" onClick={() => setOpen(false)} />
          <div id="menu" role="menu" className="fixed right-4 top-12 w-44 rounded-lg border bg-white shadow-lg py-2 z-[2001]">
            {userId ?
              <a href="/logout" role="menuitem" className="block px-3 py-2 text-sm hover:bg-gray-50">
                { language == 'ES' ? 'cerrar sesión' : 'log out' }
              </a> :
              <a href="/login" role="menuitem" className="block px-3 py-2 text-sm hover:bg-gray-50">
                { language == 'ES' ? 'iniciar sesión' : 'login' }
              </a>
            }
            {isDataCollector ? <a
              href="/auth/osm/start"
              role="menuitem"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              { language == 'ES' ? 'iniciar sesión con OSM' : 'authenticate with OSM' }
            </a> : ''
            }

            <a
              href="https://github.com/matthewboman/cameras"
              role="menuitem"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              { language == 'ES' ? 'código fuente' : 'source code' }
            </a>
          </div>
        </>
      )}
    </>
  )
}
