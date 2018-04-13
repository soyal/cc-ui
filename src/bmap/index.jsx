/**
 * 百度地图
 * 注意：高德地图和谷歌地图使用的是火星坐标系，即GCJ02，而百度使用的是百度坐标系BD09，两者需要相互转化
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

    this.map = null // 地图实例
    this.defaultZoom = 10 // 缩放等级

    this.state = {
      keyword: ''
    }
  }

  /**
   * 将GCJ02坐标系转换为BD09(百度坐标系)
   * @param {Array<Array>} 要转换的坐标 e.g [[lng, lat], [lng, lat]]
   */
  convertToBD(pointArr) {
    return new Promise((resolve, reject) => {
      const convertor = new window.BMap.Convertor()
      const points = pointArr.map(point => {
        return new window.BMap.Point(point[0], point[1])
      })

      convertor.translate(points, 3, 5, (...args) => {
        resolve(...args)
      })
    })
  }

  /**
   * 将[lng, lat]的格式转换成BMap.Point
   * @param {Array} originPoint [lng, lat]
   * @return  {BMap.Point}
   */
  convertPoint(originPoint) {
    return new window.BMap.Point(...originPoint)
  }

  /**
   * 给地图添加marker
   * @param {Array} originPoint 原始坐标 [lng, lat]
   * @param {String} label marker标签
   */
  addMarker = (originPoint, labelStr = '') => {
    const point = this.convertPoint(originPoint)
    const marker = new window.BMap.Marker(point)
    if (labelStr) {
      const label = new window.BMap.Label(labelStr, {
        offset: new window.BMap.Size(20, -10)
      })
      marker.setLabel(label)
    }
    this.map.addOverlay(marker)
  }

  /**
   * 视口基于originPoint居中
   */
  focus = (originPoint, zoom = this.map.getZoom()) => {
    const point = new window.BMap.Point(...originPoint)
    this.map.centerAndZoom(point, zoom)
  }

  init = () => {
    const map = new window.BMap.Map('map-container')
    this.map = map

    map.enableScrollWheelZoom() // 允许滚轮缩放
    this.installAutoComplete()
  }

  /**
   * 装在自动补全
   */
  installAutoComplete() {
    const ac = new window.BMap.Autocomplete({
      input: 'searchInput',
      location: this.map
    })

    ac.addEventListener('onconfirm', e => {
      console.log('ac click')
    })
  }

  /**
   * 放大
   */
  zoomIn = () => {
    const zoom = this.map.getZoom() + 1
    this.map.setZoom(zoom)
  }

  /**
   * 缩小
   */
  zoomOut = () => {
    const zoom = this.map.getZoom() - 1
    this.map.setZoom(zoom)
  }

  search = () => {
    console.log('search')
  }

  onKeywordChange = e => {
    const value = e.target.value
    this.setState({
      keyword: value
    })
  }

  componentDidMount() {
    if (!window.BMap) {
      throw new Error(
        '请手动引入百度地图API文件, e.g: http://api.map.baidu.com/api?v=2.0&ak=您的密钥'
      )
    }

    this.init()

    // 初始化定位
    const originP = [104.065751, 30.657571]
    this.focus(originP, this.defaultZoom)

    this.addMarker(originP, '转换前的坐标')
    this.focus(originP)
    this.convertToBD([originP]).then(data => {
      const _p = data.points[0]
      this.addMarker([_p.lng, _p.lat], '转换后的坐标')
    })
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
              value={this.state.keyword}
              onChange={this.onKeywordChange}
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
            <span className="map-scale-zoomin" onClick={this.zoomIn}>
              <i className="cc-icon cc-icon-tianjia1" />
            </span>
            <span className="map-scale-zoomout" onClick={this.zoomOut}>
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
