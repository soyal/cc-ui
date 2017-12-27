import React, {Component} from 'react'
import Tabs from '../../src/tabs'

const { Tab, TabPanel: Panel } = Tabs

class DemoTabs extends Component {
  state = {
    activeKey: 'a'
  }

  render() {
    return (
      <div>
        <Tab activeKey={this.state.activeKey}
          onChange={(key) => {
            this.setState({
              activeKey: key
            })
          }}>
          <Panel tabKey="a" tab="aaa">这是第一个tab</Panel>
          <Panel tabKey="b" tab="bbb">这是第二个tab</Panel>
        </Tab>
      </div>
    )
  }
}

export default DemoTabs