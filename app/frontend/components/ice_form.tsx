import { useState } from "react"
import axios        from 'axios'

import { useLanguage } from "../hooks/language"

export default function IceForm({ address, position, userId, onSubmit }) {
  const [ errorMsg, setErrorMsg ]   = useState(null)
  const [ isLoading, setIsLoading ] = useState(false)

  const [ category, setCategory ]       = useState("")
  const [ date, setDate ]               = useState("")
  const [ description, setDescription ] = useState("")
  const [ time, setTime ]               = useState("")
  const [ title, setTitle ]             = useState("")

  const { language } = useLanguage()

  const CATEGORIES = [
    { value: 'other',            text: "(choose)" },
    { value: 'border_patrol',    text: "Border Patrol" },
    { value: 'checkpoint',       text: "Checkpoint" },
    { value: 'community_arrest', text: "Community Arrest" },
    { value: 'court_arrest',     text: "Court Arrest" },
    { value: 'home_visit',       text: "Home Visit" },
    { value: 'ice_staging',      text: "Ice Staging" },
    { value: 'ice_stakeout',     text: "Ice Stakeout" },
    { value: 'jail_arrest',      text: "Jail Arrest" },
    { value: 'observer_report',  text: "Observer Report" },
    { value: 'traffic_stop',     text: "Traffic Stop" },
    { value: 'workplace',        text: "Workplace" },
    { value: 'other',            text: "Other/Unsure" },
  ]

  const CATEGORIES_ES = [
    { value: 'other',            text: "(seleccione)" },
    { value: 'community_arrest', text: "Arresto Comunitario" },
    { value: 'jail_arrest',      text: "Arresto en Cárcel" },
    { value: 'court_arrest',     text: "Arresto en Corte" },
    { value: 'checkpoint',       text: "Checkpoint ICE" },
    { value: 'workplace',        text: "Lugar de Trabajo" },
    { value: 'other',            text: "Otra Actividad" },
    { value: 'traffic_stop',     text: "Parada de Tráfico" },
    { value: 'border_patrol',    text: "Patrulla Fronteriza" },
    { value: 'ice_staging',      text: "Preparación ICE" },
    { value: 'observer_report',  text: "Reporte de Observador" },
    { value: 'ice_stakeout',     text: "Vigilancia ICE" },
    { value: 'home_visit',       text: "Visita Domiciliaria" },
  ]

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
