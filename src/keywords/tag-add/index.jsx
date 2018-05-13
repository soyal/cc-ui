/**
 * 标签添加按钮
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.less'

class TagAdd extends Component {
  static propTypes = {
    onEnter: PropTypes.func, // 确认输入后的回调
    inputShow: PropTypes.bool,
    onClick: PropTypes.func,
    onBlur: PropTypes.func
  }

  input = null

  doOnEnter(value) {
    this.props.onEnter && this.props.onEnter(value)
  }

  onKeyUp = e => {
    if (e.keyCode === 13) {
      const value = this.input.value

      this.doOnEnter(value)
    }
  }

  render() {
    const { inputShow, onClick, onBlur } = this.props

    return (
      <div className="tp_tag-add">
        {inputShow ? (
          <input
            type="text"
            ref={dom => {
              this.input = dom
              if (dom) {
                dom.focus()
              }
            }}
            className="tp_tag-add-input"
            onKeyUp={this.onKeyUp}
            onBlur={onBlur}
          />
        ) : (
          <a className="tp_tag-add-btn" onClick={onClick}>
            {/*添加按钮*/}
            <i className="tp_tag-add-icon bg-100" />
            添加关键词
          </a>
        )}
      </div>
    )
  }
}

export default TagAdd
