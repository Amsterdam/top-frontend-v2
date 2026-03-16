import { useState, useEffect } from "react"

export const BREAKPOINTS = {
  sm: 576, // screen ≥ 576px
  md: 768, // screen ≥ 768px
  lg: 992, // screen ≥ 992px
  xl: 1200, // screen ≥ 1200px
  xxl: 1600, // screen ≥ 1600px
} as const

export function useMediaQuery(maxWidth: number = BREAKPOINTS.md): boolean {
  const [isMatch, setIsMatch] = useState<boolean>(false)

  useEffect(() => {
    function handleResize() {
      setIsMatch(window.innerWidth < maxWidth)
    }

    // Bepaal direct de juiste waarde bij mount
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [maxWidth])

  return isMatch
}
