/**
 * 分页
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.less'

class Pagination extends Component {
  static propTypes = {
    total: PropTypes.number.isRequired,  // 数据总数
    pageSize: PropTypes.number.isRequired,  // 每页条数
    current: PropTypes.number,  // 当前页数， 从1开始
    defaultCurrent: PropTypes.number,  // 默认的初始页数，默认1
    onChange: PropTypes.func,  // 点击页数更改的回调 (paegNo) => {}
    style: PropTypes.object  // 样式
  }

  constructor(props) {
    super(props)

    this.state = {
      current: props.current || props.defaultCurrent || 1,
      size: Math.ceil(props.total / props.pageSize)  // 总页数
    }
  }

  /**
   * 生成页码的数据结构
   */
  generateIndex() {
    // 最多展示7个页码，一般点亮6个，参见ant-design，
    const count = 6

    let indexes = []
    // 总页数 <= 6个，直接显示完
    if (this.state.size <= count) {

      for (let i = 0; i < this.state.size; i++) {
        indexes.push({
          type: 'span',  // span是页码，i是省略
          value: i + 1 //页码
        })
      }

      // 总数 > 6
    } else {
      // 获取点亮范围
      let lightRange = this.getIndexLightRange()
      const { first, range, last } = lightRange

      if (first) {
        indexes.push({
          type: 'span',
          value: first
        })
      }

      // 省略号
      if (range[0] - first > 1) {
        indexes.push({
          type: 'i'
        })
      }

      // 点亮的页码
      for (let i = range[0]; i <= range[1]; i++) {
        indexes.push({
          type: 'span',
          value: i
        })
      }

      // 省略
      if (last - range[1] > 1) {
        indexes.push({
          type: 'i'
        })
      }

      if (last) {
        indexes.push({
          type: 'span',
          value: last
        })
      }
    }

    return indexes
  }

  /**
   * 获取页码的点亮范围
   */
  getIndexLightRange() {
    let current = this.state.current  // 当前的页码
    let size = this.state.size  // 总页数
    let result

    // 点亮范围为 +- 2 ，周围 2 个单位的距离
    // 1, 2, 3 点亮前5个
    if (current <= 3) {
      result = {
        range: [1, 5],
        first: null,
        last: size
      }
      // 最后两个， 点亮最后5个
    } else if (current <= size && current >= (size - 2)) {
      result = {
        range: [size - 4, size],
        first: 1,
        last: null
      }
    } else {
      result = {
        range: [current - 2, current + 2],
        first: 1,
        last: size
      }
    }

    return result
  }

  /**
   * 下一页
   */
  nextPage() {
    let i = this.state.current + 1

    if (i > this.state.size) {
      i = this.state.size
    }

    this.changeIndex(i)
  }

  /**
   * 上一页
   */
  prevPage() {
    let i = this.state.current - 1
    if(i < 1) {
      i = 1
    }

    this.changeIndex(i)
  }

  /**
   * 更改页数
   * @param index 页码
   * @param report 是否上报，触发onChange 默认上报
   */
  changeIndex(index, report = true) {
    if (index < 1) {
      index = 1
    }

    if (this.state.current !== index) {
      this.setState({
        current: index
      })

      if (this.props.onChange && report) {
        this.props.onChange(index)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.state.current) {
      this.changeIndex(nextProps.current, false)
    }

    if (nextProps.total) {
      this.setState({
        size: Math.ceil(nextProps.total / nextProps.pageSize)
      })
    }
  }

  render() {
    const indexes = this.generateIndex()

    if (indexes.length < 2) {
      return null
    }

    return (
      <div className="cc-pagination" style={this.props.style}>
        <span className="cc-pagination-start"
          onClick={() => {
            this.changeIndex(1)
          }}>首页</span>
        {/*上一页按钮*/}
        <i className="cc-pagination-prev"
          onClick={this.prevPage.bind(this)}>&lt;</i>
        <div className="cc-pagination-index">
          {/*渲染页数*/}
          {indexes.map((index, num) => {
            if (index.type === 'span') {
              return <span key={index.value}
                onClick={() => {
                  this.changeIndex(index.value)
                }}
                className={this.state.current === index.value ? 'active' : ''}>{index.value}</span>
            } else if (index.type === 'i') {
              return <i key={'i' + num}>...</i>
            }

            return ''
          })}
        </div>
        {/*下一页按钮*/}
        <i className="cc-pagination-next"
          onClick={this.nextPage.bind(this)}>&gt;</i>
        <span className="cc-pagination-end"
          onClick={() => {
            this.changeIndex(this.state.size)
          }}>尾页</span>
      </div>
    )
  }
}

export default Pagination