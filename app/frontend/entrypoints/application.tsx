import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Outlet,
  Routes,
  Route
} from "react-router-dom"
import Home from '../pages/home.js'

import "../styles/application.css"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

function Layout() {
  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
    </>
  )
}

root.render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route
          path    = "/"
          element = {<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
)