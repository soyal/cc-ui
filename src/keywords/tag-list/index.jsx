import React from 'react'
import Tag from '../tag'
import TagAdd from '../tag-add'
import PropTypes from 'prop-types'
import './index.less'

function TagList({
  data,
  inputShow,
  onClose,
  onEnter,
  onAddClick,
  onInputBlur
}) {
  return (
    <div className="tp_keywords-ctn">
      {data.map((item, index) => (
        <Tag
          text={item}
          key={item}
          onClose={() => {
            onClose(item, index)
          }}
        />
      ))}
      <TagAdd
        onEnter={onEnter}
        inputShow={inputShow}
        onClick={onAddClick}
        onBlur={onInputBlur}
      />
    </div>
  )
}

TagList.propTypes = {
  data: PropTypes.array, //  Array<String>
  onClose: PropTypes.func,
  onEnter: PropTypes.func,
  inputShow: PropTypes.bool, // 是否显示添加关键词的input
  onInputBlur: PropTypes.func, // 添加关键词的input blur的回调
  onAddClick: PropTypes.func // 点击添加标签的回调
}

export default TagList
