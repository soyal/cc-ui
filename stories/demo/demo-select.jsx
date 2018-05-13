import React from 'react'
import Select from '../../src/select'

class SelectDemo extends React.Component {
  state = {
    activeKey: 'a'
  }

  render() {
    const options = [
      {
        key: 'a',
        text: 'a text',
        value: 'aaa'
      },
      {
        key: 'b',
        text: 'b text',
        value: 'bbb'
      }
    ]

    return (
      <div>
        <h3>普通select</h3>
        <Select options={options} activeKey={this.state.activeKey} />

        <h3>theme: grey</h3>
        <Select
          options={options}
          activeKey={this.state.activeKey}
          theme="grey"
          style={{
            fontSize: '18px',
            color: '#333',
            height: '54px'
          }}
        />
      </div>
    )
  }
}

export default SelectDemo
