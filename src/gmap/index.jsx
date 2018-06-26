/**
 * 高德地图封装
 * 需要用户手动引入高德的js库
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.less'

let AMap = window.AMap

function loadAMap(cb) {
  const script = document.createElement('script')
  script.src =
    '//webapi.amap.com/maps?v=1.3&key=26339b2f15f1daeefb8eacb7130bc0c3'
  script.async = false
  document.head.appendChild(script)
  script.onload = cb
}

/**
 * 在点击了联想词或者点击了搜索之后调用回调传递经纬度
 */
class FsMap extends Component {
  static propTypes = {
    coordinate: PropTypes.arrayOf(PropTypes.number), // 地图初始化的时候的经纬度 设置为[0, 0]componentDidMount后不会触发onChange，设置null会回到天府新区的地理位置
    /**
     * 每次用户通过搜索或者点击操作更改了经纬度的时候，触发，会返回一个对象
     * {coordinate: [lng, lat], success: 是否获取地址成功, address: 逆向编码获取到的地址}
     */
    onChange: PropTypes.func,
    defaultCenter: PropTypes.arrayOf(PropTypes.number), // 默认地图中心点
    defaultZoom: PropTypes.number, // 默认的缩放值
    noty: PropTypes.object, // 实现了noty接口的提示器
    inputDisabled: PropTypes.bool, // 禁止输入，如果为true，无法通过click来控制浮标
    radius: PropTypes.number // 区域半径
  }

  static defaultProps = {
    //104.065751,30.657571 为天府广场的经纬度
    defaultCenter: [104.065751, 30.657571],
    defaultZoom: 10,
    inputDisabled: false,
    radius: 0,
    noty: {
      success: () => {},
      info: () => {},
      warning: () => {},
      error: () => {}
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      keyValue: '' //搜索的关键字
    }
  }

  _loadPlugin(pluginName, cb) {
    if (this.map) {
      this.map.plugin(pluginName, cb)
    }
  }

  /**
   * 装载高德地图自动补全
   */
  autoComplete() {
    this._loadPlugin('AMap.Autocomplete', () => {
      let auto = new AMap.Autocomplete({
        input: this.refs.searchInput
      })

      // 点击联想词后的回调
      let map = this.map
      AMap.event.addListener(auto, 'select', e => {
        map.setZoom(15)
        // 标记
        const location = e.poi.location
        if (location) {
          this.setCoordinate(e.poi.location)
        } else {
          const info = '无效的地理位置'
          console.error(info)
          this.props.noty.warning(info)
        }
      })
    })
  }

  /**
   * 将在input中回车的按键操作给阻止了，防止一些在form中的异常情况
   */
  blockEnter = e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }

  setMarker(location) {
    // 设置Marker
    if (this.marker) {
      this.marker.setPosition(location)
    } else {
      this.marker = new AMap.Marker({
        map: this.map,
        position: location,
        draggable: !this.props.inputDisabled
      })

      AMap.event.addListener(this.marker, 'dragend', e => {
        const lnglat = e.lnglat
        const coor = [lnglat.lng, lnglat.lat]
        this.callBackCoordinate(coor)
      })
    }

    this.setCircle(location)

    return this.marker
  }

  setCircle(location, radius = this.props.radius) {
    if (radius === 0) {
      if (this.circle) {
        this.circle.setRadius(0)
      }
      return
    }

    // 设置Circle
    if (this.circle) {
      this.circle.setCenter(location)
      this.circle.setRadius(radius)
    } else {
      const circle = new AMap.Circle({
        center: location, // 圆心位置
        radius, //半径
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200', //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
      circle.setMap(this.map)

      this.circle = circle
    }

    return this.circle
  }

  /**
   * 装载search相关的插件
   */
  loadSearch() {
    this._loadPlugin('AMap.PlaceSearch', () => {
      this.placeSearch = new AMap.PlaceSearch({
        pageSize: 1,
        pageIndex: 1
        // map: this.map
      })
    })
  }

  /**
   * 装载定位插件
   */
  loadGeolocation() {
    this._loadPlugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 5000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(22, 23), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      })

      this.map.addControl(geolocation)
      this.geolocation = geolocation
    })
  }

  /**
   * 装载逆地理编码插件
   */
  loadGeocoder() {
    this._loadPlugin('AMap.Geocoder', () => {
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'base'
      })

      // this.setCoordinate(this.props.coordinate, true)
    })
  }

  /**
   * 监听对地图的点击，记录经纬度，设置marker
   */
  listenMapClick() {
    this.map.on('click', e => {
      let longitutde = e.lnglat.getLng()
      let latitude = e.lnglat.getLat()

      this.setCoordinate([longitutde, latitude])
    })
  }

  /**
   * 搜索框输入值发生变化对应的回调
   */
  onSearchInputChange(e) {
    this.setState({
      keyValue: e.target.value
    })
  }

  /**
   * 拉近
   */
  zoomIn() {
    let curZoom = this.map.getZoom()

    this.map.setZoom(++curZoom)
  }

  /**
   * 拉远
   */
  zoomOut() {
    let curZoom = this.map.getZoom()

    this.map.setZoom(--curZoom)
  }

  /**
   * 调用父组件传递的onChange，上报经纬度和详细地址
   * @param location Array [longitude, latitude]
   * @param cancelNoty 取消noty提示
   */
  callBackCoordinate(location, cancelNoty) {
    const noty = this.props.noty
    // 调用回调，将坐标上报到父组件那里去
    if (this.props.onChange) {
      let target

      // 统一传递出去的坐标的格式
      if (location instanceof Array) {
        target = location
        // 处理高德地图的location格式
      } else {
        target = [location.lng, location.lat]
      }

      // 默认[0, 0]不进行逆地理编码
      if (target[0] === 0 && target[1] === 0) return

      if (!this.geocoder) {
        noty.warning('逆地理编码插件加载失败')
        return false
      }
      // 进行逆地理编码，根据经纬度获取具体位置信息
      this.geocoder.getAddress(target, (status, result) => {
        // 获取地址成功
        if (status === 'complete' && result.info === 'OK') {
          const address = result.regeocode.formattedAddress //返回地址描述
          const { addressComponent: ad = {} } = result.regeocode

          // 定位成功进行提示
          if (!cancelNoty) {
            noty.success(`设置地理位置成功，位置：${address}`, 5000)
          }

          this.props.onChange({
            success: true,
            coordinate: target,
            address: address,
            province: ad.province,
            city: ad.city,
            district: ad.district,
            adcode: ad.adcode
          })
          // 获取地址失败
        } else {
          noty.warning(`设置地理位置失败`)
          this.props.onChange({
            success: false,
            coordinate: target,
            address: '逆地理编码失败'
          })
        }
      })
    }
  }

  /**
   * 设置坐标，在这个方法中会回调onChange
   * @param {Array} locatino [longitude, latitude]
   * @param {Boolean} cancelNoty 取消提示
   * @param {Boolean} cancelMarker 取消进行marker地位，只进行视觉定位
   * @param {Boolean} triggerOnChange 是否触发onChange
   */
  setCoordinate(location, cancelNoty, cancelMarker, triggerOnChange = true) {
    this.map.setCenter(location)

    if (cancelMarker) {
      return false
    }

    // 设置marker的位置
    this.setMarker(location)

    if (triggerOnChange) {
      this.callBackCoordinate(location, cancelNoty)
    }
  }

  // 执行搜索，搜索结果的第一个设置为用户的经纬度
  search() {
    const noty = this.props.noty

    if (this.state.keyValue === '') return false

    this.placeSearch.search(this.state.keyValue, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        let location = result.poiList.pois[0].location
        this.setCoordinate(location)
      } else {
        noty.warning('搜索失败')
      }
    })
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout)
  }

  componentWillReceiveProps(nextProps) {
    const nCoo = nextProps.coordinate
    const cCoo = this.props.coordinate
    // 判断是否coordinate更改
    if (nCoo && (!cCoo || nCoo.join(',') !== cCoo.join(','))) {
      this.setCoordinate(nextProps.coordinate, true, false, false)
      this.setCircle(nCoo)
      console.log('1', nCoo)
    } else {
      const nRadius = nextProps.radius
      const oRadius = this.props.radius
      if (nRadius !== oRadius) {
        this.setCircle(nCoo, nRadius)
        console.log('2', nCoo)
      }
    }
  }

  render() {
    const { inputDisabled } = this.props

    return (
      <div className="cc-map-wrapper">
        {/*地图的工具组 包括搜索、放大缩小、定位*/}
        {inputDisabled ? null : (
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
                onChange={this.onSearchInputChange.bind(this)}
                onKeyDown={this.blockEnter}
                onKeyPress={this.blockEnter}
                onKeyUp={e => {
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  if (e.keyCode === 13) {
                    // this.search()
                    e.preventDefault()
                  }
                }}
              />
              <span
                className="map-search-icon"
                onClick={this.search.bind(this)}
              >
                <i className="cc-icon cc-icon-sousuo" />
              </span>
            </div>

            {/*放大缩小*/}
            <div className="cc-map-scale">
              <span
                className="map-scale-zoomin"
                onClick={this.zoomIn.bind(this)}
              >
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
        )}
        {/*地图容器*/}
        <div className="cc-map" id="map-container" ref="mapContainer" />
      </div>
    )
  }

  init() {
    this.map = new AMap.Map(this.refs.mapContainer, {
      zoom: this.props.defaultZoom
    })

    if (this.props.coordinate) {
      this.setCoordinate(this.props.coordinate, false, false, false)
    } else {
      this.setCoordinate(this.props.defaultCenter, true, true, false)
    }

    this.autoComplete()
    this.loadSearch()
    this.loadGeocoder()
    // 禁用输入则不响应click，也不能进行定位
    if (!this.props.inputDisabled) {
      this.listenMapClick()
      this.loadGeolocation()
    }
  }

  componentDidMount() {
    if (!AMap) {
      loadAMap(() => {
        AMap = window.AMap

        this.init()
      })
    } else {
      this.init()
    }
  }
}

export default FsMap
