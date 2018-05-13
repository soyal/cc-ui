/**
 * 下拉选择器
 */
import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './index.less'

class Select extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //当前所选择的option的key
    options: PropTypes.array.isRequired, // [{text: 显示的文字, key: 唯一键值, value: any}]
    placeholder: PropTypes.string, // 占位文字
    onChange: PropTypes.func, // 进行选择后的回调
    selected: PropTypes.bool, // 是否展开下拉面板
    onSelect: PropTypes.func, // 面板展开或者收起的回调 (isSelected: boolean): void
    theme: PropTypes.string // white || grey 主题
  }

  static defaultProps = {
    placeholder: '--请选择--',
    selected: false,
    theme: 'white',
    options: []
  }

  state = {
    status: 'deactive', // deactive normal active
    activeKey: this.props.activeKey || '',
    longestOptionText: this.findLongestOptionText(this.props.options)
  }

  constructor(props) {
    super(props)

    this.onDocumentClick = this.onDocumentClick.bind(this)
  }

  /**
   * 找到最长的option text
   * @param {Array} options
   * @return {String}
   */
  findLongestOptionText(options) {
    let text = ''

    options.forEach(option => {
      if (option.text.length > text.length) {
        text = option.text
      }
    })

    return text
  }

  _active(triggerOnSelect = true) {
    this.setState({
      status: 'active'
    })

    if (triggerOnSelect) {
      this.doOnSelect(true)
    }
  }

  _deactive(triggerOnSelect = true) {
    this.setState({
      status: 'deactive'
    })

    if (triggerOnSelect) {
      this.doOnSelect(false)
    }
  }

  _normal(triggerOnSelect = true) {
    this.setState({
      status: 'normal'
    })

    if (triggerOnSelect) {
      this.doOnSelect(false)
    }
  }

  /**
   * option被选择后的回调
   * @param {String} key option key
   * @param {Boolean} triggerOnChange 是否回传数据，触发onChange
   */
  _onSelect(key, triggerOnChange = true, triggerOnSelect = true) {
    if (key !== this.state.activeKey) {
      this.setState(
        {
          activeKey: key
        },
        () => {
          if (key === '') {
            this._deactive(triggerOnSelect)
          } else {
            this._normal(triggerOnSelect)
          }
        }
      )
    } else {
      if (key === '') {
        this._deactive(triggerOnSelect)
      } else {
        this._normal(triggerOnSelect)
      }
    }

    if (triggerOnChange) {
      const activeOption = this.props.options.find(option => {
        return option.key === key
      })

      this.doOnChange(key, activeOption.value || null)
    }
  }

  /**
   * 回传数据
   * @param {String} value
   */
  doOnChange(key, value) {
    this.props.onChange && this.props.onChange(key, value)
  }

  doOnSelect(isSelect) {
    this.props.onSelect && this.props.onSelect(isSelect)
  }

  getSelectedText() {
    const activeKey = this.state.activeKey

    if (activeKey === '') {
      return this.props.placeholder
    }
    let activeItem = this.props.options.find(option => {
      return option.key === activeKey
    })
    return activeItem ? activeItem.text : this.props.placeholder
  }

  toggleStatus(e) {
    const { status } = this.state

    if (status === 'deactive' || status === 'normal') {
      this._active()
    } else {
      this._normal()
    }
  }

  onDocumentClick(e) {
    if (this.state.activeKey === '') {
      this._deactive()
    } else if (this.state.status === 'active') {
      this._normal()
    }
  }

  componentWillReceiveProps(nextProps) {
    // activeKey的变更
    const nKey = nextProps.activeKey
    if (nKey !== undefined && nKey !== this.state.activeKey) {
      this._onSelect(nKey, false)
    }

    // 下拉面板是否展开的变更
    const nSelected = nextProps.selected
    if (nSelected !== this.props.selected) {
      if (nSelected) {
        this._active(false)
      } else {
        this._onSelect(this.state.activeKey, false, false)
      }
    }

    // options的变更
    const nOptions = nextProps.options
    if (
      nOptions.length !== this.props.options &&
      nOptions[0] !== this.props.options[0]
    ) {
      this.setState({
        longestOptionText: this.findLongestOptionText(nOptions)
      })
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
  }

  render() {
    const { status, longestOptionText } = this.state
    const { className, style, options, theme } = this.props

    return (
      <div
        className={classnames('mpc-select', className, theme)}
        style={style}
        onClick={e => {
          // 捕获元素内部的click，不让其冒泡到document
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        }}
      >
        {/*文字显示部分*/}
        <div
          className={classnames('mpc-select_text', status)}
          onClick={this.toggleStatus.bind(this)}
        >
          <span className="mpc-select_text-span">
            {longestOptionText || this.getSelectedText()}
          </span>
          <span className="mpc-select_text-span-true">
            {this.getSelectedText()}
          </span>
          <i className="mpc-select_triangle" />
        </div>

        {/*下拉面板*/}
        {status === 'active' ? (
          options.length > 0 ? (
            <ul className="mpc-select_panel">
              {this.props.options.map(option => (
                <li
                  key={option.key}
                  className={classnames('mpc-select_panel-item', {
                    active: option.key === this.state.activeKey
                  })}
                  onClick={() => {
                    this._onSelect(option.key)
                  }}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mpc-select_panel">
              <li className="mpc-select_panel-item">无</li>
            </ul>
          )
        ) : null}
      </div>
    )
  }
}

export default Select
