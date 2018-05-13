/**
 * tab头部
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.less'

class Tab extends Component {
  static propTypes = {
    defaultActiveKey: PropTypes.string, // 默认激活的tab索引值，默认为第一个面板
    activeKey: PropTypes.string, // 激活的面板的key
    onChange: PropTypes.func, // 切换面板的回调
    customTemplate: PropTypes.object // 自定义模板
  }

  constructor(props) {
    super(props)

    // 遍历出children中的相关信息
    let headItems = [],
      children = props.children

    if (children.length > 1) {
      children.forEach(c => {
        headItems.push({
          key: c.props.tabKey,
          title: c.props.tab
        })
      })
    } else {
      headItems.push({
        key: children.tabKey,
        title: children.tab
      })
    }

    this.state = {
      headItems: headItems,
      activeKey: props.defaultActiveKey || props.activeKey || headItems[0].key
    }
  }

  /**
   * 切换tab
   * @param {*} key
   */
  changeActiveKey(key) {
    this.setState({
      activeKey: key
    })

    if (this.props.onChange) {
      this.props.onChange(key)
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.activeKey !== undefined
  //     && this.state.activeKey !== nextProps.activeKey) {
  //     this.changeActiveKey(nextProps.activeKey)
  //   }
  // }

  render() {
    const panel = this.props.children.find(child => {
      return child.props.tabKey === this.state.activeKey
    })

    const customTemplate = this.props.customTemplate
    return (
      <div style={{ overflow: 'hidden' }} className="cc-tab">
        {/*tab头部*/}
        <div className={'cc-tab-header'}>
          {/*type === 'reverse'可以传入自定制的内容*/}
          {customTemplate ? (
            <div className="cc-tab_user-custom">{customTemplate}</div>
          ) : null}
          {/*可点击区域*/}
          <div className={'cc-tab_tabkeys'}>
            {this.state.headItems.map(item => {
              return (
                <div
                  className={`cc-tab-header-item ${
                    this.state.activeKey === item.key ? 'active' : ''
                  }`}
                  key={item.key}
                  onClick={() => {
                    this.changeActiveKey(item.key)
                  }}
                >
                  {item.title}
                </div>
              )
            })}
          </div>
        </div>
        {/*tab的panel*/}
        <div className="cc-tab-panels">{panel}</div>
      </div>
    )
  }
}

export default Tab
