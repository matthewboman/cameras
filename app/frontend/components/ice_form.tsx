import { useState } from "react"
import axios        from 'axios'

import { CATEGORIES, CATEGORIES_ES } from '../constants/ice_categories'
import { useLanguage }               from "../hooks/language"

export default function IceForm({ address, position, userId, onSubmit }) {
  const [ errorMsg, setErrorMsg ]   = useState(null)
  const [ isLoading, setIsLoading ] = useState(false)

  const [ category, setCategory ]       = useState("")
  const [ date, setDate ]               = useState("")
  const [ description, setDescription ] = useState("")
  const [ time, setTime ]               = useState("")
  const [ title, setTitle ]             = useState("")

  const { language } = useLanguage()

  // Makes POST request to add ICE sighting
  const submit = () => {
    setIsLoading(true)
    setErrorMsg(false)

    const report = {
      category:    category,
      date:        date,
      description: description,
      time:        time,
      title:       title,
      address:     address,
      location:    position,
      language:    language
    }

    axios.post("/api/report-ice", { report }, { withCredentials: true })
      .then(res => {
        onSubmit(null)
        setIsLoading(false)
      }).catch(err => {
        setIsLoading(false)
        setErrorMsg("There was an error adding the report.")
      })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-8 mb-4">
        <label className="flex flex-col flex-1">
          <span className="text-sm">
            { language == 'ES' ? 'Fecha' : 'Date' }
          </span>
          <input
            type="date"
            className="rounded-md border px-2 py-1 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col w-28 ml-auto">
          <span className="text-sm">
            { language == 'ES' ? 'Hora' : 'Time' }
          </span>
          <input
            type="time"
            className="rounded-md border px-2 py-1 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>

      <div className="my-4">
        <label className="block mb-2">
          <span className="text-sm">
            { language == 'ES' ? 'Título' : 'Title' }
          </span>
          <input
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm">
            { language == 'ES' ? 'Descripción' : 'Description' }
          </span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="my-4">
        <label className="block">
          <span className="text-sm">
            { language == 'ES' ? 'Categoría' : 'Category' }
          </span>
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            { language == 'ENG' && CATEGORIES.map(c => <option value={ c.value }>{ c.text }</option> )}
            { language == 'ES' && CATEGORIES_ES.map(c => <option value={ c.value }>{ c.text }</option> )}
          </select>
        </label>
      </div>

      <button
        disabled={isLoading}
        type="button"
        onClick={submit}
        className="rounded-md border px-3 py-1 text-sm hover:cursor-pointer"
      >
        { isLoading
          ? (language === 'ES' ? 'Cargando…' : 'Loading…')
          : (language === 'ES' ? 'Enviar' : 'Submit')
        }
      </button>

      { errorMsg }
    </div>
  )
}
