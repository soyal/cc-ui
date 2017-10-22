/**
 * 通用模态框
 */
import React, { Component } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import PropTypes from 'prop-types'

import './index.less'

class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func, //点击关闭的回调
    title: PropTypes.string,  // 模态框标题，不传就没有header
    show: PropTypes.bool  // 是否显示
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show
    })
  }

  willEnter() {
    return { opacity: 0 }
  }

  willLeave() {
    return { opacity: spring(0) }
  }

  render() {
    const { title, show, onClose,
      contentStyle, containerStyle } = this.props

    return (
      <div>
        <TransitionMotion styles={show ? [{
          key: 'modal',
          style: {
            opacity: spring(1)
          }
        }] : []}
          willEnter={this.willEnter}
          willLeave={this.willLeave}>
          {interpolatingStyles => (
            <div>
              {interpolatingStyles.map((item) => {
                return (
                  <div className="cc-modal" key={item.key}
                    style={{
                      opacity: item.style.opacity
                    }}>
                    <div className="cc-modal-content"
                      style={{
                        ...containerStyle
                      }}>

                      {/*标题，没有传入title就不显示*/}
                      {title ? (
                        <div className="cc-modal-title">
                          <h4 className="cc-modal-title-h">{title}</h4>
                        </div>
                      ) : null}

                      {/*关闭按钮*/}
                      <span className="cc-modal-close" onClick={onClose}>
                        <i className="iconfont icon-guanbi"
                          style={{
                            fontSize: '15px',
                            color: '#666'
                          }}></i>
                      </span>

                      {/*子元素在这里展示*/}
                      <div className="cc-modal-children" style={contentStyle}>
                        {this.props.children}
                      </div>
                    </div>
                    {/*遮罩*/}
                    <div className="cc-modal__cover"
                      onClick={onClose}></div>
                  </div>
                )
              })}
            </div>
          )}
        </TransitionMotion>
      </div>
    )
  }
}

export default Modal