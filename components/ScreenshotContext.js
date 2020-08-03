import React, { useContext } from 'react'

const ScreenshotContext = React.createContext([false, () => {}])

const ScreenshotProvider = ({screenshot, children}) => {
  const [isScreenshot, setIsScreenshot] = React.useState(screenshot)
  return (
    <ScreenshotContext.Provider value={[isScreenshot, setIsScreenshot]}>
      {children}
    </ScreenshotContext.Provider>
  )
}

const useScreenshot = () => {
  const [isScreenshot, setIsScreenshot] = useContext(ScreenshotContext)
  return { isScreenshot }
}

export { useScreenshot, ScreenshotProvider }
