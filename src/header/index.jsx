/**
 * 公用头部
 */
import React from 'react'
import StageSelect from './stage-select'
import Qrcode from './qrcode'
import PropTypes from 'prop-types'

import './index.less'

const Header = ({
  qrText,
  userName,
  photo,
  logout,
  settingUrl,
  stage,
  hideRight = false
}) => {
  return (
    <div className="header clearfix">
      {/*logo*/}
      <div className="header__logo">
        <i className="iconfont icon-logo" />
      </div>

      {/*左侧平台切换*/}
      <StageSelect stage={stage} />

      {/*右侧的用户信息*/}
      {hideRight ? null : (
        <div className="header__menu">
          {/*用户信息相关*/}
          <div className="header-userinfo">
            {/*头像*/}
            <div
              className="header-userinfo-photo bg-cover"
              style={{
                backgroundImage: `url(${photo})`
              }}
            />
            {/*名字*/}
            <span className="header-userinfo-name">{userName}</span>

            {/*hover显示的用户操作项*/}
            <ul className="header-userinfo-operation">
              <li className="operation-item">
                <a className="operation-item-link" href={settingUrl}>
                  用户设置
                </a>
              </li>
              <li className="operation-item" onClick={logout}>
                退出登录
              </li>
            </ul>
          </div>
          <i style={{ marginLeft: '10px' }} className="header-divde-line" />

          <Qrcode qrText={qrText} />
        </div>
      )}
    </div>
  )
}

Header.propTypes = {
  qrText: PropTypes.string, // 二维码内容
  userName: PropTypes.string, // 用户名
  photo: PropTypes.string, // 头像url
  logout: PropTypes.func, //  点击‘注销’的回调
  settingUrl: PropTypes.string, // 用户设置对应的url
  /**
   * {name: '文化号', options: [{name: '管理平台', to: '//example.fishsaying.com'}]}
   */
  stage: PropTypes.object,
  hideRight: PropTypes.bool // 隐藏右侧用户信息部分
}

export default Header
