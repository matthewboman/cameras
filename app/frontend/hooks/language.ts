import { useEffect, useState } from "react"

const STORAGE_KEY = "language"

function getStoredLanguage(): "ES" | "ENG" {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === "ENG" ? "ENG" : "ES"
}

function setStoredLanguage(lang: "ES" | "ENG") {
  localStorage.setItem(STORAGE_KEY, lang)
  window.dispatchEvent(new Event("languagechange"))
}

export function useLanguage() {
  const [language, setLanguage] = useState<"ES" | "ENG">(getStoredLanguage())

  useEffect(() => {
    function handleChange() {
      setLanguage(getStoredLanguage())
    }

    window.addEventListener("languagechange", handleChange)
    return () => window.removeEventListener("languagechange", handleChange)
  }, [])

  function toggleLanguage() {
    const next = language === "ES" ? "ENG" : "ES"
    setStoredLanguage(next)
  }

  return { language, toggleLanguage }
}
