# 鱼说通用组件库

## quick start
安装
```
npm install --save @fs/cc-ui --registry=http://npm.fishsaying.com
```
配置按需加载
```
npm install --save @fs/babel-plugin-import --registry=http://npm.fishsaying.com
```
 
```
babel配置
{
    plugin: [
        ['@fs/babel-plugin-import',{
            libraryName: "@fs/cc-ui",
            style: "css"
        }]
    ]
}
```

使用
```
import {Button} from '@fs/cc-ui'

//...
const Demo = () => {
    return (
        <div>
            <Button type="primary" size="medium">按钮</Button>
        </div>
    )
}
```


## Table
### 入参
* columns: array<object>, 定制表头信息，e.g: [{dataIndex: 'name', title: '姓名'}, {dataIndex: 'age', title: '年龄'}]
* data: array<object>, 表格的数据信息，信息需要和columns对应，e.g: [{key:1, name: 'a', age: 1}, {key: 2, name: 'b', age: 2}]

### example
```javascript
import {Table} from '@fs/cc-ui'
//...
const Demo = () => {
    const columns =  [{dataIndex: 'name', title: '姓名', render: (name) => {
        return (
            <span>{name}</span>
        )
    }}, {dataIndex: 'age', title: '年龄'}]
    const data =  [{key:1, name: 'a', age: 1}, {key: 2, name: 'b', age: 2}]
    return (
        <Table columns={columns} data={data}></Table>
    )
}
//...
```

## Modal
模态框组件
### 入参
* show: boolean, 是否显示
* onClose: function, 点击X或者点击遮罩关闭模态框时候触发的回调
* title: string, 模态框标题

### example
```javascript
import React, {Component} from 'react'
import {Modal} from '@fs/cc-ui'
//...
class Demo extends Component {
    state = {
        show: false
    }

    render() {
        return (
            <Modal title="测试用例"
                    show={this.state.show}
                    onClose={() => {
                        this.setState({
                            show: false
                        })
                    }}>
                        <div>这是自定义内容</div>
                    </Modal>
        )
    }
}
//...
```

## Pagination
分页组件

### 入参
* total: number, 总数据条数
* pageSize: number, 每页数据条数
* current: number, 当前页数
* onChange: (pageNo: number): void, 切换页数的回调

### example
```javascript
import React, {Component} from 'react'
import { Pagination } from '@fs/cc-ui'
//...
class Demo extends Component {
    state = {
        pageNo: 1
    }

    render() {
        return (
            <Pagination total={20}
                    current={this.state.pageNo}
                    pageSize={10}
                    onClose={(pageNo) => {
                        this.setState({
                            pageNo
                        })
                    }}></Pagination>
        )
    }
}
//...
```

## GMap
高德地图组件

### 入参
* coordinate: Array [lng, lat],e.g:[134.111, 56] 地图初始化定位的经纬度
* onChange: function,(data: Object): void 定位的回调 data: {coordinate: [lng, lat], success: 是否获取地址成功, address: 逆向编码获取到的地址}
* noty: Object, 实现了noty接口的对象, {warning: function, success: function, error: function, info: function}

### example

```javascript
import { Gmap } from '@fs/cc-ui'

const Demo = () => {
  return (
    <div style={{
      width: '400px',
      height: '400px'
    }}>
      <Gmap coordinate={[0, 0]}
            onChange={(data) => {
                // do something
            }}
            noty={{
                success: () => {
                    alert('success')
                },
                error: () => {
                    alert('error')
                },
                info: () => {
                    alert('info')
                },
                warning: () => {
                    alert('warning')
                }
            }}></Gmap>
    </div>
  )
}
```

## 关键词

### 入参
* data: Array<String>, 显示的关键词, i.e: ['key1', 'key2']
* candidate: Array<String>, 下拉框中的候选关键词, i.e: ['候选词1', '候选词2']
* onChange: (data: Array<String>): void, 对显示关键词作修改的回调，包括添加和删除都会触发
* onFetch: (): Boolean, 点击获取关键词按钮的回调, 返回为true表示希望在点击获取后展开下拉面板

### example

```javascript
import React from 'react'
import {Keywords} from '@fs/cc-ui'

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
          }}></Keywords>
    </div>
  )
}

export default DemoKeywords
```

## 公共头部(Header)

### 入参
* data: Array<String>, 显示的关键词, i.e: ['key1', 'key2']
* candidate: Array<String>, 下拉框中的候选关键词, i.e: ['候选词1', '候选词2']
* onChange: (data: Array<String>): void, 对显示关键词作修改的回调，包括添加和删除都会触发
* onFetch: (): Boolean, 点击获取关键词按钮的回调, 返回为true表示希望在点击获取后展开下拉面板

### example

* qrText: String, 生成的二维码对应的字符串
* userName: String, 右侧显示的用户名
* photo: String, 右侧显示的用户头像url
* logout: function, hover用户头像下拉中,点击退出登录的回调
* settingUrl: String, 点击用户设置跳转的url
* stage: Object, 左侧平台hover后的下拉数据结构, e.g{name: '文化号', options: [{name: '管理平台', to: '//example.fishsaying.com'}]}
* hideRight: Boolean, 是否隐藏右侧内容(包括用户姓名，二维码)
* hideHoverDown : Boolean, 是否隐藏用户头像hover下拉(用户设置，退出登录等)