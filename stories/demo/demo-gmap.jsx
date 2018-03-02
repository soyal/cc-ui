import React, { Component } from 'react'
import AMap from '../../src/gmap'

import 'gmap/index.css'

class Demo extends Component {
  state = {
    coordinate: [0, 0]
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        coordinate: [104.065751, 30.657571]
      })
    }, 500)
  }

  render() {
    return (
      <div
        style={{
          width: '400px',
          height: '400px'
        }}
      >
        <AMap
          coordinate={this.state.coordinate}
          onChange={({ coordinate, success, address }) => {
            console.log('gmap onchange', success, address)
          }}
        />
      </div>
    )
  }
}

export default Demo
