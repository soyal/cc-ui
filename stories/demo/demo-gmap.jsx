import React, { Component } from 'react'
import AMap from '../../src/gmap'

import 'gmap/index.css'

class Demo extends Component {
  state = {
    coordinate: [100.065751, 25.657571]
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        coordinate: [104.065751, 30.657571]
      })
    }, 1000)
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
          defaultCenter={this.state.coordinate}
          onChange={result => {
            console.log('gmap onchange', result)
          }}
        />
      </div>
    )
  }
}

export default Demo
