/**
 * 百度地图
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

class BDMap extends PureComponent {
  static propTypes = {
    mapKey: PropTypes.string,
    isAuto: PropTypes.bool, // 是否自动定位
    coordinate: PropTypes.arrayOf(PropTypes.number), // 坐标
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      keyValue: ''
    }
  }

  init = () => {
    console.log('init')
    const map = new window.BMap.Map('map-container')
    const point = new window.BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
  }

  zoomIn = () => {
    console.log('zoom in')
  }

  zoomOut = () => {
    console.log('zoom out')
  }

  search = () => {
    console.log('search')
  }

  componentDidMount() {
    if (!window.BMap) {
      throw new Error(
        '请手动引入百度地图API文件, e.g: http://api.map.baidu.com/api?v=2.0&ak=您的密钥'
      )
    }

    this.init()
  }

  render() {
    const { className } = this.props

    return (
      <div className={classnames('cc-map-wrapper', className)}>
        {/*地图的工具组 包括搜索、放大缩小、定位*/}
        <div className="cc-map-toolbar">
          {/*搜索*/}
          <div className="cc-map-search">
            <input
              id="searchInput"
              ref="searchInput"
              type="text"
              className="map-search-input"
              placeholder="查找位置"
              value={this.state.keyValue}
              onChange={() => {
                console.log('search')
              }}
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  // this.search()
                }
              }}
            />
            <span className="map-search-icon" onClick={this.search.bind(this)}>
              <i className="cc-icon cc-icon-sousuo" />
            </span>
          </div>

          {/*放大缩小*/}
          <div className="cc-map-scale">
            <span className="map-scale-zoomin" onClick={this.zoomIn.bind(this)}>
              <i className="cc-icon cc-icon-tianjia1" />
            </span>
            <span
              className="map-scale-zoomout"
              onClick={this.zoomOut.bind(this)}
            >
              <i className="cc-icon cc-icon-zhankai" />
            </span>
          </div>
        </div>
        {/*地图容器*/}
        <div className="cc-map" id="map-container" />
      </div>
    )
  }
}

export default BDMap
