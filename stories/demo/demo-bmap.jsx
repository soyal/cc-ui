/**
 * 百度地图用例
 */
import React from 'react'
import BDMap from '../../src/bmap'

class BDMapDemo extends React.Component {
  state = {
    coordinate: [104.065751, 30.657571]
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
          onChange={(location, result) => {
            console.log(`location: ${location}, result: ${result}`)
          }}
        />

        <button
          onClick={() => {
            this.changeCoordinate()
          }}
        >
          更改经纬度
        </button>
      </div>
    )
  }
}

export default BDMapDemo
