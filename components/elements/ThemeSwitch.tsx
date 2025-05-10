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
    <a
      className="btn btn-mode change-mode mr-25"
      onClick={toggleColorMode}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '12px',
        // backgroundColor: 'var(--bs-neutral-100)',
        cursor: 'pointer',
        minWidth: '40px',
        height: '40px'
      }}
    >
      {colorMode === "light" ? (
        <img
          className="light-mode"
          src="/assets/imgs/template/icons/light-w.svg"
          alt="Light Mode"
          style={{ width: '20px', height: '20px' }}
        />
      ) : (
        <img
          className="dark-mode"
          src="/assets/imgs/template/icons/light.svg"
          alt="Dark Mode"
          style={{ width: '20px', height: '20px' }}
        />
      )}
    </a>
  )
}