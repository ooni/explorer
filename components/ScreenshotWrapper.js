import React from 'react'
import { useScreenshot } from './ScreenshotContext'

export default function ScreenshotWrapper ({ color, children }) { 
  const [isScreenshot, setIsScreenshot] = useScreenshot()
  return (
    isScreenshot ? (
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
