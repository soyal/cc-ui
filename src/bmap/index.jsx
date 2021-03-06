/**
 * 百度地图
 * 注意：高德地图和谷歌地图使用的是火星坐标系，即GCJ02，而百度使用的是百度坐标系BD09，两者需要相互转化
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

const defaultZoom = 13
// const defaultPos = [104.065751, 30.657571]
/**
 * 坐标回传的触发: 地图点击， marker拖拽, 搜索, 自动定位
 */
class BDMap extends PureComponent {
  static propTypes = {
    mapKey: PropTypes.string,
    isAuto: PropTypes.bool, // 是否自动定位
    coordinate: PropTypes.arrayOf(PropTypes.number), // 坐标
    defaultCenter: PropTypes.arrayOf(PropTypes.number), // 默认的地图中心点
    onChange: PropTypes.func,
    style: PropTypes.object,
    autoLocate: PropTypes.bool, // 是否自动定位
    className: PropTypes.string
  }

  static defaultProps = {
    defaultCenter: [104.065751, 30.657571],
    autoLocate: false
  }

  constructor(props) {
    super(props)

    this.searchInput = null // search input ref

    this.coordinate = props.coordinate || null // 定位的坐标，这个是记录的外部坐标，是高德坐标系
    this.lastCoor = null // 记录每次posMarker定位后的位置，是百度坐标系
    this.map = null // 地图实例
    this.geolocation = null // 定位实例
    this.geocoder = null // 编码器实例
    this.localSearch = null // 本地搜索
    this.autoComplete = null
    this.overlay = {} // 添加的覆盖物
    this.pendingPromise = null

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

      convertor.translate(points, from, to, result => {
        resolve(
          result.points.map(p => {
            return [p.lng, p.lat]
          })
        )
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

    // 添加覆盖物
    this.addCircle(originPoint, this.props.radius)
    this.lastCoor = originPoint

    posMarker.addEventListener('dragend', async e => {
      const p = e.point
      const ad = await this.pointToAddress(p)
      const op = [p.lng, p.lat]
      // this.updatePosMarkerTitle(ad)
      this.updatePosMarker(op, ad)
      // this.map.setCenter(p)

      this.doOnChange(op, ad)
    })

    posMarker.setTop(true)

    this.overlay.marker = posMarker
  }

  updatePosMarker(originPoint, title) {
    const marker = this.overlay.marker
    if (!marker) {
      this.addPosMarker(originPoint, title)
      return
    }

    if (originPoint) {
      this.lastCoor = originPoint
      this.updateCircle(originPoint, this.props.radius)
      this.__updatePosMarkerPosition(originPoint)
    }

    if (title) {
      this.__updatePosMarkerTitle(title)
    }
  }

  __updatePosMarkerTitle(title) {
    const marker = this.overlay.marker
    if (!marker) return

    const label = marker.getLabel()
    label.setTitle(title)
    marker.setLabel(label)
    marker.getLabel().setContent(title)
  }

  __updatePosMarkerPosition(originPoint) {
    const marker = this.overlay.marker
    if (!marker) return

    marker.setPosition(this.convertPoint(originPoint))
    // this.map.setCenter(point)
  }

  /**
   * 添加圆形覆盖物
   * @param {Array<Number>} originPoint
   * @param {Number} radius 半径，单位m
   */
  addCircle = (originPoint, radius) => {
    this._removeOverlay('circle')
    if (!radius) return

    const point = this.convertPoint(originPoint)
    const circle = new window.BMap.Circle(point, radius, {
      strokeColor: 'blue',
      strokeWeight: 2,
      strokeOpacity: 0.5
    })
    this.overlay['circle'] = circle

    this.map.addOverlay(circle)
  }

  updateCircle = (originPoint, radius) => {
    if (!radius) return

    const circle = this.overlay['circle']
    if (!circle) {
      this.addCircle(originPoint, radius)
    } else {
      if (originPoint) {
        const point = this.convertPoint(originPoint)
        circle.setCenter(point)
      }

      if (radius) {
        circle.setRadius(radius)
      }
    }
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
        resolve(result.address)
      })
    })
  }

  /**
   * 定位
   */
  async doPos() {
    if (!this.geolocation) {
      // this.geolocation = new window.BMap.Geolocation()
      this.geolocation = new window.BMap.LocalCity()
    }
    const self = this
    if (this.pendingPromise) {
      await this.pendingPromise
    }

    return (this.pendingPromise = new Promise((resolve, reject) => {
      const geo = this.geolocation
      geo.get(async result => {
        const point = result.center
        const address = await self.pointToAddress(point)

        this.pendingPromise = null
        resolve({
          location: [point.lng, point.lat],
          address
        })
      })
      // geo.getCurrentPosition(
      //   async function(result) {
      //     if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
      //       const point = result.point
      //       console.log('point ', point)
      //       const address = await self.pointToAddress(point)

      //       this.pendingPromise = null
      //       resolve({
      //         location: [point.lng, point.lat],
      //         address
      //       })
      //     } else {
      //       reject()
      //     }
      //   },
      //   { enableHighAccuracy: true }
      // )
    }))
  }

  /**
   * 通过外部传入的经纬度进行视口矫正和marker定位
   * @param {Array<Number>} coordinate [lng, lat]
   * @param {Boolean} mark 是否添加marker
   */
  async posByCoordinate(coordinate, mark = true) {
    if (this.pendingPromise) {
      await this.pendingPromise
    }

    // 为了防止posByCoordinate和doPos两个方法相互干扰
    this.pendingPromise = Promise.resolve(
      (async () => {
        const originPoints = await this.convertToBD([coordinate])
        const p = originPoints[0]
        const address = await this.pointToAddress(this.convertPoint(p))
        mark && this.addPosMarker(p, address)
        this.focus(p, defaultZoom)
        this.pendingPromise = null
      })()
    )
  }

  /**
   * 自动定位
   * @param {Boolean} addMarker 是否添加marker
   */
  doAutoPos = async addMarker => {
    try {
      const result = await this.doPos()
      this.focus(result.location, defaultZoom)
      if (addMarker) {
        this.addPosMarker(result.location, result.address)
        this.doOnChange(result.location, result.address)
      }
    } catch (e) {
      alert('定位出错')
    }
  }

  doLocalSearch(keyword) {
    if (!this.localSearch) {
      this.localSearch = new window.BMap.LocalSearch(this.map, {
        onSearchComplete: results => {
          const target = results.zr[0]
          if (!target) return

          const address = target.title
            ? target.address + '-' + target.title
            : target.address

          const p = target.point

          this.updatePosMarker([p.lng, p.lat], address)
          this.map.setCenter(p)

          this.doOnChange([p.lng, p.lat], address)
        }
      })
    }

    this.localSearch.search(keyword)
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

  __init = () => {
    const map = new window.BMap.Map('map-container')
    this.map = map

    map.enableScrollWheelZoom() // 允许滚轮缩放
    this.__installAutoComplete()
    this.__listenMapClick()
    this.__listenMapDragEnd()
  }

  /**
   * 装载自动补全
   */
  __installAutoComplete() {
    this.autoComplete = new window.BMap.Autocomplete({
      input: 'searchInput',
      location: this.map
    })

    this.autoComplete.addEventListener('onconfirm', e => {
      const value = e.item.value.business
      this.doLocalSearch(value)
    })
  }

  /**
   * 检测对地图的点击
   */
  __listenMapClick() {
    this.map.addEventListener('click', async e => {
      const p = e.point
      const ad = await this.pointToAddress(p)
      this.updatePosMarker([p.lng, p.lat], ad)
      // this.updatePosMarkerPosition(p)
      // this.updatePosMarkerTitle(ad)

      this.doOnChange([p.lng, p.lat], ad)
    })
  }

  /**
   * 监听对地图的拖拽
   */
  __listenMapDragEnd() {
    this.map.addEventListener('dragend', e => {
      const center = this.map.getCenter()
      this.autoComplete.setLocation(center)
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

  onSearch = () => {
    this.doLocalSearch(this.searchInput.value)
  }

  /**
   * 回调onChange
   * @param {Array} location [lng, lat]
   * @param {String} address 地址信息
   * @param {String} title 知名地点的标题
   */
  async doOnChange(location, address, title = '') {
    const points = await this.convertToGD([location])
    this.coordinate = points[0]

    this.props.onChange && this.props.onChange(points[0], address)
  }

  onPosClick = e => {
    this.doAutoPos(false)
  }

  componentWillReceiveProps(nextProps) {
    const nCoo = nextProps.coordinate
    const cCoo = this.coordinate

    // 对比父组件传进的coordinate与上次onChange的时候记录的coordinate的差别
    if (nCoo && (!cCoo || nCoo.join(',') !== cCoo.join(','))) {
      this.coordinate = nCoo
      this.posByCoordinate(nCoo)
    } else if (nextProps.radius !== this.props.radius) {
      this.updateCircle(this.lastCoor, nextProps.radius)
    }
  }

  async componentDidMount() {
    if (!window.BMap) {
      throw new Error(
        '请手动引入百度地图API文件, e.g: http://api.map.baidu.com/api?v=2.0&ak=您的密钥'
      )
    }

    this.__init()

    if (this.props.coordinate) {
      this.posByCoordinate(this.props.coordinate)
    } else {
      // 自动定位
      if (this.props.autoLocate) {
        this.doAutoPos(false)
        // 坐标定位
      } else {
        this.posByCoordinate(this.props.defaultCenter, false)
      }
    }
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
              ref={dom => {
                this.searchInput = dom
              }}
              type="text"
              className="map-search-input"
              placeholder="查找位置"
            />
            <span className="map-search-icon" onClick={this.onSearch}>
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
          <span
            className="map-icon-pos map-icon-item"
            onClick={this.onPosClick}
          >
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
