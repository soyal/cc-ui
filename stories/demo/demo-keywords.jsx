import React from 'react'
import Keywords from '../../src/keywords'

const DemoKeywords = () => {
  return (
    <div>
      <Keywords data={['k1', '关键词1']}
          candidate={['候选词1', '候选词2', '候选词3']}
          onChange={(data) => {
            console.log(data)
          }}
          onFetch={() => {
            alert('获取关键词触发')
            return true
          }}></Keywords>
    </div>
  )
}

export default DemoKeywords