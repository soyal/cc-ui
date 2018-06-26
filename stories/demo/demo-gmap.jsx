import React, { Component } from 'react'
import AMap from '../../src/gmap'

import 'gmap/index.css'

class Demo extends Component {
  state = {
    coordinate: [100.065751, 25.657571],
    radius: 0
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
          defaultZoom={13}
          radius={this.state.radius}
          onChange={result => {
            console.log('gmap onchange', result)
            this.setState({
              coordinate: result.coordinate
            })
          }}
        />
        <input
          type="number"
          value={this.state.radius}
          onChange={e => {
            const value = e.target.value || 0
            this.setState({
              radius: parseInt(value, 10)
            })
          }}
        />
      </div>
    )
  }
}

export default Demo
