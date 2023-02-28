// From: https://github.com/LucasBassetti/react-css-loaders/tree/master/lib/spin
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { theme } from 'ooni-components'

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const spinnerAnimation = props =>
  css`
    ${loading} ${props.duration}s infinite linear;
  `

const Spin = styled.div`
  animation: ${spinnerAnimation};
  background: ${props => props.color};
  background: ${props => `linear-gradient(to right, ${props.color} 10%, rgba(255, 255, 255, 0) 42%);`};
  border-radius: 50%;
  font-size: ${props => `${props.size}px`};
  height: 11em;
  margin: ${props => props.margin};
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  width: 11em;

  &:before {
    background: ${props => props.color};
    border-radius: 100% 0 0 0;
    content: '';
    height: 50%;
    left: 0;
    position: absolute;
    top: 0;
    width: 50%;
  }

  &:after {
    background: ${props => props.background};
    border-radius: 50%;
    bottom: 0;
    content: '';
    height: 75%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 75%;
  }
`

const SpinLoader = props => (
  <Spin {...props} />
)

SpinLoader.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
  margin: PropTypes.string,
}

SpinLoader.defaultProps = {
  background: '#fff',
  color: theme.colors.blue5,
  duration: 1.4,
  size: 5,
  margin: '50px auto',
}

export default SpinLoader
