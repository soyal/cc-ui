/**
 * 备选词下拉列表
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

function WordsPanel({ data, onClick }) {
  return (
    <div className="tp_words-panel"
        onClick={(e) => {
          e.preventDefault()
          e.nativeEvent.stopImmediatePropagation()
        }}>
      {data.map((item, index) => (
        <span className="tp_words-word"
            key={item}
            onClick={() => {
              onClick(item, index)
            }}>{item}</span>  
      ))}
    </div>
  )
}

WordsPanel.propTypes = {
  data: PropTypes.array,  //  Array<string> 候选词数组
  onClick: PropTypes.func  // (text, index): void 回传被点击的候选词的内容和索引
}

export default WordsPanel