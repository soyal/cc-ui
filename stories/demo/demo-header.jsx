import React from 'react'
import Header from '../../src/header'

const HeaderDemo = () => {
  return (
    <Header
      stage={{
        name: '测试平台',
        options: [
          {
            name: '平台1',
            to: '//www.fishsaying.com'
          },
          {
            name: '平台2',
            to: '//test1-cp.cpmap.com'
          }
        ]
      }}
      hideRight={false}
      hideHoverDown={true}
      userName="鱼说测试"
      photo="//static-cdn.fishsaying.com/cultrue-cc/logo.png"
      logout={() => {
        alert('logout')
      }}
      settingUrl="//www.baidu.com"
    />
  )
}

export default HeaderDemo
