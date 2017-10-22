/**
 * 通用的按钮
 */

import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

let Button = ({ children, size, type, shape, style, onClick, to, disabled,
  onMouseEnter, onMouseOut, className }) => {
  let classNames = []

  // 设置大小
  if (size) {
    classNames.push(size)
  } else {
    classNames.push('medium')
  }

  // 形状，可选circle
  if (shape) {
    classNames.push(shape)
  }

  // 如果传递了disabled，将onclick事件移除
  if (disabled) {
    // 将样式设置为disable
    classNames.push('disable')

    return <a style={{
      ...style,
      cursor: 'default'
    }}
      onClick={(e) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
      className={`cc-button ${classNames.join(' ')}`}>{children}</a>
  }

  // 主题
  if (type) {
    classNames.push(type)
  }

  return (
    to ? (
      <Link style={style}
        onClick={onClick}
        to={to}
        onMouseEnter={onMouseEnter}
        onMouseOut={onMouseOut}
        className={classnames(`cc-button ${classNames.join(' ')}`, className)}>{children}</Link>
    ) : (
        <span style={style}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseOut={onMouseOut}
          className={classnames(`cc-button ${classNames.join(' ')}`, className)}>{children}</span>
      )
  )
}

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,  // 主题类型，可选primary, disable，默认default
  shape: PropTypes.string,  // 形状，可选circle，默认无
  size: PropTypes.string.isRequired,  // 大小，必选，medium或者large
  style: PropTypes.object,  // 样式
  onClick: PropTypes.func,  // 点击的回调
  disabled: PropTypes.bool,  // 是否禁用，默认false
  to: PropTypes.string,  // 用于react-router路由跳转，如果传递会渲染成Link
  onMouseEnter: PropTypes.func,
  onMouseOut: PropTypes.func
}

export default Button