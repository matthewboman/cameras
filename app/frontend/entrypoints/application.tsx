import { createRoot } from "react-dom/client"

// Components
import Map    from '../components/map.tsx'
import Navbar from "../components/navbar.tsx"

// Pages
import Ice    from '../pages/ice.tsx'
import Home   from '../pages/home.tsx'

import "../styles/application.css"

document.addEventListener("DOMContentLoaded", () => {
  const components = {
    Ice,
    Home,
    Map,
    Navbar
  }

  document.querySelectorAll("[data-react]").forEach(el => {
    const name      = el.dataset.react
    const Component = components[name]
    const props     = JSON.parse(el.getAttribute("data-props") || "{}")

    if (Component) {
      createRoot(el).render(<Component { ...props } />)
    }
  })
})
