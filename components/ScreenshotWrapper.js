import React from 'react'
import { ScreenshotContext } from './ScreenshotContext'

export default function ScreenshotWrapper ({ color, screenshot, children }) { 
  const [isScreenshot, setIsScreenshot] = React.useContext(ScreenshotContext)
  setIsScreenshot(screenshot)

  return (
    screenshot ? (
      <div style={{
        display: 'flex',
        height: '100vh', 
        backgroundColor: color,
        flexDirection: 'column', 
        justifyContent: 'space-between'
      }} >
        {children}
      </div>
    ) : children
  )
}
