/**
 * header的二维码容器
 */
import React, { Component } from 'react'
import AwesomeQRCode from 'art-qr'
import PropTypes from 'prop-types'

import './index.less'

const logoUrl = '//static-cdn.fishsaying.com/cultrue-cc/logo.png'
class Qrcode extends Component {
  static propTypes = {
    qrText: PropTypes.string  // 二维码内容
  }

  static defaultProps = {
    qrText: ''
  }

  state = {
    qrcodeSrc: ''  //二维码的地址
  }

  /**
   * 生成二维码
   */
  generateQrcode(qrcodeContent) {
    let image = new Image()
    image.crossOrigin = '*'

    image.onload = () => {
      new AwesomeQRCode().create({
        text: qrcodeContent,
        logoImage: image,
        logoMargin: 0,
        size: 160,
        margin: 0,
        whiteMargin: false,
        dotScale: 1,
        callback: (dataURI) => {
          this.setState({
            qrcodeSrc: dataURI
          })
        }
      })
    }

    image.src = logoUrl

  }

  componentWillReceiveProps(nextProps) {
    const nQrText = nextProps.qrText
    if(nQrText && (nQrText !== this.props.qrText)) {
      this.generateQrcode(nextProps.qrText)
    }
  }

  /**
   * 在组件安装后拉取二维码数据
   */
  componentDidMount() {
    const { qrText } = this.props
    if(qrText) {
      this.generateQrcode(qrText)
    }
  }

  componentWillUnmount() {
    this.unmount = true
  }

  render() {
    return (
      <div className="header-qrcode">
        <i className="iconfont icon-erweima header-qrcode-trigger"></i>
        {/*hover后显示的二维码*/}
        <div className="header-qrcode-ctn">
          <img src={this.state.qrcodeSrc} alt="" className="header-qrcode-code" style={{marginBottom: '10px'}}/>
          <p className="header-qrcode-info">微信扫一扫</p>
          <p className="header-qrcode-info">进入您的文化号主页</p>
        </div>
      </div>
    )
  }
}

export default Qrcode