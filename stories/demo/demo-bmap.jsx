/**
 * 百度地图用例
 */
import React from 'react'
import BDMap from '../../src/bmap'

class BDMapDemo extends React.Component {
  render() {
    return (
      <div
        style={{
          width: '400px',
          height: '400px'
        }}
      >
        <BDMap />
      </div>
    )
  }
}

export default BDMapDemo
