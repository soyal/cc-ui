/**
 * 用于管理Radio
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RadioGroup extends Component {
  static propTypes = {
    onChange: PropTypes.func, // 值改变的回调
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 默认选中的值
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) // 用于设置当前选中的值
  }

  static childContextTypes = {
    radioGroup: PropTypes.object
  }

  constructor(props) {
    super()

    let children = props.children,
      value
    if (children instanceof Array) {
      value = children[0].props.value
    } else {
      value = children.props.value
    }

    this.state = {
      value: props.defaultValue || value
    }
  }

  getChildContext() {
    return {
      radioGroup: {
        onChange: this.onChange.bind(this),
        value: this.state.value
      }
    }
  }

  onChange(value) {
    this.setState({
      value: value
    })

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== undefined) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

export default RadioGroup
