import React from 'react'
import PropTypes from 'prop-types'

import './index.less'

const Tag = ({ text, onClose }) => {
  return (
    <div className="tp_tag">
      <span className="tp_tag-text">{text}</span>
      <i className="tp_tag-close bg-100"
        onClick={onClose}></i>
    </div>
  )
}

Tag.propTypes = {
  text: PropTypes.string,  // tag显示的文字
  onClose: PropTypes.func  // 关闭的回调
}

export default Tag