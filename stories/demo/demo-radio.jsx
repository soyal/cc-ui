import React, { Component } from 'react'
import Radio from '../../src/radio'

const { RadioGroup } = Radio

class DemoRadio extends Component {
  state = {
    value: 'banana'
  }

  render() {
    return (
      <div>
        <RadioGroup
          value={'banana'}
          onChange={value => {
            this.setState({ value })
          }}
        >
          <Radio value="apple">苹果</Radio>
          <Radio value="pear">梨</Radio>
          <Radio value="banana">香蕉</Radio>
        </RadioGroup>
      </div>
    )
  }
}

export default DemoRadio
