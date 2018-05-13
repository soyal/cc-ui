import React, { Component } from 'react'
import Loader from './pulse-loader'
import PropTypes from 'prop-types'

import './index.less'

class Spin extends Component {
  static propTypes = {
    show: PropTypes.bool, // 是否显示
    size: PropTypes.string // 'small' || 'medium' || 'large'
  }

  static defaultProps = {
    show: false,
    size: 'medium'
  }

  _getSize(size) {
    switch (size) {
      case 'small':
        return '12px'
      case 'large':
        return '24px'
      default:
        return '16px'
    }
  }

  render() {
    return (
      <div className="cui-spin">
        {/*loader*/}
        {this.props.show ? (
          <div className="cui-spin_cover">
            <Loader
              color="#81d4c5"
              size={this._getSize(this.props.size)}
              margin="4px"
            />
          </div>
        ) : null}
        {this.props.children}
      </div>
    )
  }
}

export default Spin
