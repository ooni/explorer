import { useState, useEffect } from 'react'

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  // Equivalent of componentDidMount and componentDidUpdate
  // Limited to run only once by passing `[]` as second argument
  useEffect(() => {
    setIsMobile(window.innerWidth < 800)
  }, [])

  return isMobile
}
