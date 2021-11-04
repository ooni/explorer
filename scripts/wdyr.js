import React from 'react'

if (process.env.NODE_ENV === 'development' && process.env.WDYR === '1') {
  if (typeof window !== 'undefined') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      include: [
        /^RowChart/,
        /^Row/
      ],
      exclude: [
        /^AxisTick/
      ],
      // trackExtraHooks: [
      // ]
    })
  }
}
