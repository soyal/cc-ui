/**
 * 关键词
 */
import React, { Component } from 'react'
import TagList from './tag-list'
import WordsPanel from './words-panel'
import PropTypes from 'prop-types'
import noty from '@fs/noty'

import './index.less'

class Keywords extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),  // 显示的关键词
    candidate: PropTypes.arrayOf(PropTypes.string),  // 候选词
    onChange: PropTypes.func,  // 用户对关键词进行操作后的回调，回传更改后的关键词 (data: Array<string>):void
    onFetch: PropTypes.func  // 点击获取关键词按钮触发
  }

  state = {
    showPanel: false,
    inputShow: false
  }

  /**
   * 切换panel的显示和隐藏
   */
  togglePanel = (e) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({
      showPanel: !this.state.showPanel
    })
  }

  _showInput = () => {
    this.setState({
      inputShow: true
    })
  }

  _hideInput = () => {
    this.setState({
      inputShow: false
    })
  }

  closePanel = () => {
    this.setState({
      showPanel: false
    })
  }

  showPanel = () => {
    this.setState({
      showPanel: true
    })
  }

  onFetchClick = () => {
    this.showPanel()
    this.props.onFetch()
  }

  doOnChange = (data) => {
    this.props.onChange && this.props.onChange(data)
  }

  /**
   * 关键词被删除后的回调
   */
  onWordDel = (text, index) => {
    const data = this.props.data.slice()

    data.splice(index, 1)

    this.doOnChange(data)
  }

  /**
   * @param {String} text 文字
   * @param {Number} 在candidate中的索引
   */
  onWordAdd = (text, index) => {
    const data = this.props.data.slice()
    text = text.trim()
    if(!text) return

    // 添加的关键词已经存在
    if(data.indexOf(text) > -1) {
      noty.warning(`${text}已经存在`)
      return
    }

    data.push(text)

    this.doOnChange(data)

    if(this.state.inputShow === true) {
      this._hideInput()
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.closePanel)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePanel)
  }

  render() {
    const { showPanel, inputShow } = this.state
    const { data, candidate } = this.props

    return (
      <div className="tp_keywords">
        {/*标题*/}
        <h4 className="tp_keywords-title">
          关键词
          <span className="tp_keywords-tip">
            (限10个关键词)
          </span>
        </h4>

        <div className="tp_keywords-wrap">
          {/*关键词显示容器*/}
          <div className="tp_keywords-container">
            {/*关键词*/}
            <TagList data={data}
              onClose={this.onWordDel}
              onEnter={this.onWordAdd}
              onAddClick={this._showInput}
              onInputBlur={this._hideInput}
              inputShow={inputShow}></TagList>

            {/*下拉按钮*/}
            {candidate.length > 0 ? (
              <span className="tp_keywords-down"
                onClick={this.togglePanel}>
                <i className="tp_keywords-down-icon bg-100"></i>
              </span>
            ) : null}

            {/*候选词下拉面板*/}
            {showPanel ? (
              <WordsPanel data={candidate}
                onClick={this.onWordAdd}></WordsPanel>
            ) : null}
          </div>

          {/*button*/}
          <a className="tp_keywords-btn"
            onClick={this.onFetchClick}>获取关键词</a>
        </div>
      </div>
    )
  }
}

export default Keywords