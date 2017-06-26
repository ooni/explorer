import React from 'react'

import NoSSR from 'react-no-ssr'
import DAT from './vendor/webgl-globe'
import TWEEN from 'tween.js'

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

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'static/population909500.json', true);
    var onreadystatechangecallback = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          window.data = data;
          for (i=0;i<data.length;i++) {
            globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
          }
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
      <div>
        <div className='globe' ref={(el) => { this.globeRef = el; }} />
      <style jsx>{`
        .globe {
          height: 350px;
          width: 350px;
        }
      `}</style>
      </div>
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
