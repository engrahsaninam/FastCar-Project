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
          src="/assets/imgs/template/icons/light.svg"
          alt="Dark Mode"
          style={{ width: '20px', height: '20px' }}
        />
      ) : (
        <svg className="moon dark-mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
        </svg>
        // <img
        //   className="dark-mode"
        //   src="/assets/imgs/template/icons/light.svg"
        //   alt="Dark Mode"
        //   style={{ width: '20px', height: '20px' }}
        // />
      )}
    </a>
  )
}