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

class WebGLGlobe extends React.Component {

  static propTypes = {
  }

	static defaultProps = {
    size: 100
	}
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false;
  }

  componentDidMount () {
    var _this = this;
    var container = this.globeRef;

    /*
     * if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {
    }
    */

    var opts = {imgDir: 'static/', animated: true};
    var globe = new DAT.Globe(container, opts);
    var i, tweens = [];


    let dummyData = []
    /*
    for (i=0;i<10000;i++) {
      dummyData.push(random(-100, 100))
      dummyData.push(random(-100, 100))
      dummyData.push(random(0, 0.8, true))
    }

    dummyData.push(41.9)
    dummyData.push(12.49)
    dummyData.push(0.3)
    globe.addData(dummyData, {format: 'magnitude', animated: true})
    globe.createPoints()
    globe.time = 0
    globe.animate()
    */

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'static/map-magnitude.json', true);
    var onreadystatechangecallback = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          window.data = data.coordinates;
          globe.addData(data.coordinates, {format: 'magnitude', animated: true});
          globe.createPoints();
          globe.time = 0
          globe.animate();
        }
      }
    };
    xhr.onreadystatechange = onreadystatechangecallback.bind(this);
    xhr.send(null);
  }

  render () {
    return (
      <StyledGlobe innerRef={(el) => { this.globeRef = el; }} />
    )
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
