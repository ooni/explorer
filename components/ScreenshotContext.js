import React, { useState, useContext } from 'react'

const ScreenshotContext = React.createContext([{}, () => {}])

const ScreenshotProvider = props => {
  const [isScreenshot, setIsScreenshot] = useState({})
  return (
    <ScreenshotContext.Provider value={[isScreenshot, setIsScreenshot]}>
      {props.children}
    </ScreenshotContext.Provider>
  )
}

const useScreenshot = () => {
  return useContext(ScreenshotContext)
}

export { ScreenshotContext, ScreenshotProvider, useScreenshot }
