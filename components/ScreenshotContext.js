import React, { useContext } from 'react'

const ScreenshotContext = React.createContext([false, () => {}])

const ScreenshotProvider = props => {
  const [isScreenshot, setIsScreenshot] = React.useState()
  return (
    <ScreenshotContext.Provider value={[isScreenshot, setIsScreenshot]}>
      {props.children}
    </ScreenshotContext.Provider>
  )
}

export { ScreenshotContext, ScreenshotProvider }
