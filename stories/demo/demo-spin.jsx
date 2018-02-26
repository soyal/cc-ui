import React from 'react'
import Spin from '../../src/spin'

const Demo = () => {
  return (
    <Spin show={true}>
      <div style={{
        display: 'inline-block',
        width: '100px',
        height: '100px',
        background: 'red'
      }}>
        <p>11111111111</p>
        <p>2222222222</p>
        <p>3333333333</p>
      </div>
    </Spin>
  )
}

export default Demo
