/**
 * tab面板
 */
import React from 'react'
import PropTypes from 'prop-types'

let TabPanel = ({ children }) => {
  return <div className="cc-tab-panel">{children}</div>
}

TabPanel.propTypes = {
  tabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 对应activeKey
  tab: PropTypes.string.isRequired // 选项卡显示的文字
}

export default TabPanel
