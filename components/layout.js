import React from 'react'

import Header from './header'

export default class extends React.Component {

  static propTypes = {
    children: React.PropTypes.array.isRequired
  }

  render () {
    return (
      <div>
        <Header/>
        <div>
          { this.props.children }
        </div>

        <footer></footer>
      </div>
    )
  }
}
