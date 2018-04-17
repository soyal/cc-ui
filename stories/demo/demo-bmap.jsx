/**
 * 百度地图用例
 */
import React from 'react'
import BDMap from '../../src/bmap'

class BDMapDemo extends React.Component {
  state = {
    coordinate: [104.065751, 30.657571],
    radius: 1000
  }

  changeCoordinate() {
    this.setState({
      coordinate: [105.065751, 31.657571]
    })
  }

  render() {
    return (
      <div
        style={{
          width: '400px',
          height: '400px'
        }}
      >
        <BDMap
          coordinate={this.state.coordinate}
          radius={this.state.radius}
          onChange={(location, address) => {
            console.log(`location: ${location}, address: ${address}`)
            this.setState({
              coordinate: location
            })
          }}
        />
        <p>radius: {this.state.radius}</p>

        <button
          onClick={() => {
            this.changeCoordinate()
          }}
        >
          更改经纬度
        </button>

        <button
          onClick={() => {
            this.setState({
              radius: this.state.radius + 10
            })
          }}
        >
          +circle
        </button>
        <button
          onClick={() => {
            let r = this.state.radius - 10
            r = r < 0 ? 0 : r
            this.setState({
              radius: r
            })
          }}
        >
          -circle
        </button>
      </div>
    )
  }
}

export default BDMapDemo
