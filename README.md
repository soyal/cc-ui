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
    plugin: ['@fs/babel-plugin-import']
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
* columns: array<object>, 定制表头信息，e.g: [{dataIndex: 'name'}, {dataIndex: 'age'}]
* data: array<object>, 表格的数据信息，信息需要和columns对应，e.g: [{name: 'a', age: 1}, {name: 'b', age: 2}]

### example
```javascript
import {Table} from '@fs/cc-ui'
//...
const Demo = () => {
    const columns = [{dataIndex: 'name'}, {dataIndex: 'age'}]
    const data = [{name: 'a', age: 1}, {name: 'b', age: 2}]
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

