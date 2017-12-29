import React, { Component } from 'react'
import Pagination from '../../src/pagination'

class Demo extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 100
  }

  render() {
    return (
      <div>
        <button onClick={() => {
          this.setState({
            total: 0
          })
        }}>change total</button>
        <Pagination {...this.state}
          onChange={(pageNo) => {
            this.setState({
              current: pageNo
            })
          }}></Pagination>
      </div>
    )
  }
}

export default Demo