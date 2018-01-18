/**
 * form radio
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import RadioGroup from './radio-group'

import './index.less'

class Radio extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired  // radio的值，用来判断是否选中的依据
  }

  static contextTypes = {
    radioGroup: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.checked !== undefined) {
      this.setState({
        checked: nextProps.checked
      })
    }
  }

  render() {
    const { value , children} = this.props
    const {radioGroup} = this.context

    return (
      <div className="cc-radio">
        <label className={`cc-radio-label ${radioGroup.value === value ? 'active' : ''}`}
                onClick={() => {
                  radioGroup.onChange(value)
                }}>
          <span className="cc-radio-circle"/>
          <span className="cc-radio-text">{children}</span>
        </label>
      </div>
    )
  }
}

Radio.RadioGroup = RadioGroup

export default Radio