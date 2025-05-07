'use client'
import { useEffect, useState } from "react"

export default function BackToTop({ target = "body" }) {
  const [hasScrolled, setHasScrolled] = useState(false)
  
  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 100)
    }
    
    window.addEventListener("scroll", onScroll)
    // Initial check in case page is already scrolled on mount
    onScroll()
    
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  
  const handleClick = () => {
    const targetElement = document.querySelector(target)
    if (targetElement) {
      // Type assertion to HTMLElement which has offsetTop property
      const htmlElement = targetElement as HTMLElement
      window.scrollTo({
        top: htmlElement.offsetTop,
        behavior: 'smooth'
      })
    } else {
      // Fallback to top of page if target element not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
  
  return (
    <>
      {hasScrolled && (
        <button
          id="scrollUp"
          onClick={handleClick}
          aria-label="Scroll to top"
          title="Back to top"
          style={{
            // position: 'fixed',
            zIndex: 100,
            cursor: 'pointer',
            bottom: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#f56565',
            color: 'white',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s, transform 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e53e3e'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f56565'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = '#e53e3e'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = '#f56565'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 2.5V17.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M3.75 8.75L10 2.5L16.25 8.75" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </>
  )
}