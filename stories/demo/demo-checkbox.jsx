import React, { Component } from 'react'
import Checkbox from '../../src/checkbox'

class CheckboxDemo extends Component {
  state = {
    checked: true
  }

  render() {
    return (
      <div>
        <Checkbox
          checked={this.state.checked}
          onChange={e => {
            this.setState({
              checked: e.target.checked
            })
          }}
        >
          苹果
        </Checkbox>
      </div>
    )
  }
}

export default CheckboxDemo
