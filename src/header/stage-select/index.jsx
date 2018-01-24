import React from 'react'
import classnames from 'classnames'

import './index.less'

const StageSelect = ({ stage }) => {
  return (
    <div className="header__select">
      <div
        className={classnames('header__select-trigger', {
          'show-down': stage.options && stage.options.length > 0
        })}
      >
        <span>{stage.name}</span>
      </div>
      {stage.options && stage.options.length > 0 ? (
        <div className="header__select-dropdown">
          {stage.options.map(({ name, to }) => (
            <a href={to} key={name} className="header__select-item">
              {name}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default StageSelect
