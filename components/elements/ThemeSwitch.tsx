'use client'

import { useEffect } from "react"
import { useColorMode } from "@chakra-ui/react"

export default function ThemeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    // Sync Chakra's color mode with Bootstrap's data-bs-theme
    document.documentElement.setAttribute("data-bs-theme", colorMode)
    
    // Also update localStorage for your existing logic
    localStorage.setItem("toggleTheme", colorMode)
  }, [colorMode])

  return (
    <a className="btn btn-mode change-mode mr-15" onClick={toggleColorMode}>
      {colorMode === "light" ? (
        <img className="light-mode" src="/assets/imgs/template/icons/light.svg" alt="Light Mode" />
      ) : (
        <img className="dark-mode" src="/assets/imgs/template/icons/light-w.svg" alt="Dark Mode" />
      )}
    </a>
  )
}