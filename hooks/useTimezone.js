import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'ooni-explorer-timezone'

export const TimezoneContext = createContext({
  timezone: 'UTC',
  localTimezone: 'UTC',
  setTimezone: () => {},
})

export const TimezoneProvider = ({ children }) => {
  const [timezone, setTimezoneState] = useState('UTC')
  const [localTimezone, setLocalTimezone] = useState('UTC')

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detected) setLocalTimezone(detected)
    } catch {
      // Intl.DateTimeFormat is unsupported or has no timezone data
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setTimezoneState(stored)
    } catch {
      // localStorage may be unavailable (private browsing, disabled storage)
    }
  }, [])

  const setTimezone = (tz) => {
    setTimezoneState(tz)
    try {
      window.localStorage.setItem(STORAGE_KEY, tz)
    } catch {
      // ignore persistence failures
    }
  }

  return (
    <TimezoneContext.Provider value={{ timezone, localTimezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  )
}

const useTimezone = () => useContext(TimezoneContext)

export default useTimezone
