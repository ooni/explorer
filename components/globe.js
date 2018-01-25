import React from 'react'

import random from 'lodash.random'
import NoSSR from 'react-no-ssr'
import DAT from './vendor/webgl-globe'
import TWEEN from 'tween.js'

import styled from 'styled-components'

const StyledGlobe = styled.div`
  height: 350px;
  width: 350px;
`

const isWebGLEnabled = () => {
  // Check for the WebGL rendering context
  if ( !! window.WebGLRenderingContext) {
    var canvas = document.createElement('canvas'),
      names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
      context = false;
    for (var i in names) {
      try {
        context = canvas.getContext(names[i]);
        if (context && typeof context.getParameter === 'function') {
          // WebGL is enabled.
          return true
        }
      } catch (e) {}
    }
    // WebGL is supported, but disabled.
    return false
  }
  // WebGL not supported.
  return false
}

class WebGLGlobe extends React.Component {

  static propTypes = {
  }

	static defaultProps = {
    size: 100
	}
  constructor(props) {
    super(props)
    this.state = {
      webGLEnabled: isWebGLEnabled()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false;
  }

  componentDidMount () {
    let container = this.globeRef
    if (this.state.webGLEnabled) {
      let opts = {
        imgDir: 'static/',
        animated: true
      }
      const globe = new DAT.Globe(container, opts);

      let i
      let xhr
      let tweens = []

      xhr = new XMLHttpRequest()
      xhr.open('GET', 'static/map-magnitude.json', true)
      let onreadystatechangecallback = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText)
            window.data = data.coordinates
            globe.addData(data.coordinates, {format: 'magnitude', animated: true})
            globe.createPoints()
            globe.time = 0
            globe.animate()
          }
        }
      }

      xhr.onreadystatechange = onreadystatechangecallback.bind(this)
      xhr.send(null)
    }
  }

  render () {
    const {
      webGLEnabled
    } = this.state

    if (webGLEnabled) {
      return (
        <StyledGlobe innerRef={(el) => { this.globeRef = el; }} />
      )
    } else {
      return <div>Your browser does not support WebGL</div>
    }
  }
}

export default class Globe extends React.Component {
  render () {
    return (
      <NoSSR>
        <WebGLGlobe />
      </NoSSR>
    )
  }
}
