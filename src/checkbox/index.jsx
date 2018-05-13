import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

const Checkbox = ({
  checked = false,
  className,
  style,
  onChange,
  children
}) => {
  const id = 'cc-checkbox-' + Math.random()

  return (
    <div className={classnames('cc-checkbox_wrap', className)} style={style}>
      <div className="cc-checkbox_container">
        {/*用于显示是否勾选*/}
        <label
          className={classnames('cc-checkbox_gou', { checked: checked })}
          htmlFor={id}
        >
          <input
            type="checkbox"
            className="cc-checkbox_input"
            checked={checked}
            onChange={onChange}
            id={id}
          />
          <i className="cc-checkbox_ico bg-cover" />
        </label>

        {/*文字*/}
        <label htmlFor={id}>
          <span className="cc-checkbox_text">{children}</span>
        </label>
      </div>
    </div>
  )
}

Checkbox.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  checked: PropTypes.bool,
  onChange: PropTypes.func // (checked: Boolean): void
}

export default Checkbox
