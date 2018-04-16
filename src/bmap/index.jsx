/**
 * 百度地图
 * 注意：高德地图和谷歌地图使用的是火星坐标系，即GCJ02，而百度使用的是百度坐标系BD09，两者需要相互转化
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

const defaultZoom = 12
const defaultPos = [104.065751, 30.657571]
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
    this.geolocation = null // 定位实例
    this.geocoder = null // 编码器实例
    this.overlay = {} // 添加的覆盖物

    this.state = {
      keyword: ''
    }
  }

  /**
   * 将GCJ02坐标系转换为BD09(百度坐标系)
   * @param {Array<Array>} 要转换的坐标 e.g [[lng, lat], [lng, lat]]
   */
  convertToBD(pointArr) {
    return this._convertCS(pointArr, 3, 5)
  }

  /**
   * 将BD09(百度坐标系)切换为GCJ02(高德坐标系)
   * @param {*} pointArr
   */
  convertToGD(pointArr) {
    return this._convertCS(pointArr, 5, 3)
  }

  /**
   * 切换坐标系
   * @param {*} pointArr
   * @param {*} from
   * @param {*} to
   */
  _convertCS(pointArr, from, to) {
    return new Promise((resolve, reject) => {
      const convertor = new window.BMap.Convertor()
      const points = pointArr.map(point => {
        return new window.BMap.Point(point[0], point[1])
      })

      convertor.translate(points, from, to, (...args) => {
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
  addMarker = (originPoint, labelStr = '', options) => {
    const point = this.convertPoint(originPoint)
    const marker = new window.BMap.Marker(point, options)
    if (labelStr) {
      const label = new window.BMap.Label(labelStr, {
        offset: new window.BMap.Size(20, -10)
      })
      marker.setLabel(label)
    }
    this.map.addOverlay(marker)
    return marker
  }

  /**
   * 添加定位Marker
   */
  addPosMarker = (originPoint, labelStr = '') => {
    this._removeOverlay('marker')
    const posMarker = this.addMarker(originPoint, labelStr, {
      enableDragging: true,
      raiseOnDrag: true
    })
    posMarker.addEventListener('dragend', async e => {
      const ac = await this.pointToAddress(e.point)
      const ad = this.parseAddress(ac)
      console.log(ad)
      this.updatePosMarkerTitle(ad)
    })

    this.overlay.marker = posMarker
  }

  updatePosMarkerTitle(title) {
    const marker = this.overlay.marker
    if (!marker) return

    const label = marker.getLabel()
    label.setTitle(title)
    marker.setLabel(label)
    marker.getLabel().setContent(title)
  }

  updatePosMarkerPosition(point) {
    const marker = this.overlay.marker
    if (!marker) return

    marker.setPosition(point)
  }

  /**
   * 添加圆形覆盖物
   * @param {Array<Number>} originPoint
   * @param {Number} radius 半径，单位m
   */
  addCircle = (originPoint, radius) => {
    const point = this.convertPoint(originPoint)
    const circle = new window.BMap.Circle(point, radius, {
      strokeColor: 'blue',
      strokeWeight: 1,
      strokeOpacity: 0.5
    })
    this.overlay['circle'] = circle

    this.map.addOverlay(circle)
  }

  updateCircle = (originPoint, radius) => {
    this._removeOverlay('circle')
    this.addCircle(originPoint, radius)
  }

  _removeOverlay = name => {
    this.map.removeOverlay(this.overlay[name])
    this.overlay[name] = null
  }

  /**
   * 将坐标转换为地址(逆地理编码)
   * @param {BMap.Point} point
   * @return {AddressComponents}
   */
  pointToAddress(point) {
    if (!this.geocoder) {
      this.geocoder = new window.BMap.Geocoder()
    }

    return new Promise((resolve, reject) => {
      const geo = this.geocoder
      geo.getLocation(point, function(result) {
        resolve(result.addressComponents)
      })
    })
  }

  /**
   * 自动定位
   */
  doAutoPos() {
    if (!this.geolocation) {
      this.geolocation = new window.BMap.Geolocation()
    }
    const self = this
    return new Promise((resolve, reject) => {
      const geo = this.geolocation
      geo.getCurrentPosition(
        async function(result) {
          if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
            const point = result.point
            const position = await self.pointToAddress(point)

            resolve({
              location: [point.lng, point.lat],
              position
            })
          } else {
            reject()
          }
        },
        { enableHighAccuracy: true }
      )
    })
  }

  /**
   * 将addressComponent转换为地址字符串
   * @param {AddressComponent} ac
   */
  parseAddress(ac) {
    const result = [ac.province, ac.city]
    if (ac.district) {
      result.push(ac.district)
    }

    if (ac.street) {
      result.push(ac.street)
    }

    if (ac.streetNumber) {
      result.push(ac.streetNumber)
    }

    return result.join('')
  }

  /**
   * 视口基于originPoint居中
   */
  focus = (originPoint, zoom = this.map.getZoom()) => {
    const point = this.convertPoint(originPoint)
    this.map.centerAndZoom(point, zoom)
  }

  init = () => {
    const map = new window.BMap.Map('map-container')
    this.map = map

    map.enableScrollWheelZoom() // 允许滚轮缩放
    this.installAutoComplete()
  }

  /**
   * 装载自动补全
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
    this.map.zoomIn()
  }

  /**
   * 缩小
   */
  zoomOut = () => {
    this.map.zoomOut()
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

  async componentDidMount() {
    if (!window.BMap) {
      throw new Error(
        '请手动引入百度地图API文件, e.g: http://api.map.baidu.com/api?v=2.0&ak=您的密钥'
      )
    }

    this.init()

    const result = await this.doAutoPos()
    this.focus(result.location, defaultZoom)
    this.addPosMarker(result.location, this.parseAddress(result.position))
    // 初始化定位
    // const originP = defaultPos
    // this.focus(originP, defaultZoom)
    // // 添加覆盖物
    // this.addCircle(originP, 10)

    // this.addMarker(originP, '转换前的坐标')
    // this.focus(originP)
    // this.convertToBD([originP]).then(data => {
    //   const _p = data.points[0]
    //   this.addPosMarker([_p.lng, _p.lat], '转换后的坐标')
    // })
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
            <span
              className="map-scale-zoomin map-icon-item"
              onClick={this.zoomIn}
            >
              <i className="cc-icon cc-icon-tianjia1" />
            </span>
            <span
              className="map-scale-zoomout map-icon-item"
              onClick={this.zoomOut}
            >
              <i className="cc-icon cc-icon-zhankai" />
            </span>
          </div>
          {/* 定位 */}
          <span className="map-icon-pos map-icon-item">
            <i className="cc-icon cc-icon-pos" />
          </span>
        </div>
        {/*地图容器*/}
        <div className="cc-map" id="map-container" />
      </div>
    )
  }
}

export default BDMap
