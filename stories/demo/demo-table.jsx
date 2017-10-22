import React from 'react'
import Table from 'table'
import 'table/index.css'

const DemoTable = () => {
  const columns = [{
    key: 0,
    title: '姓名',
    dataIndex: 'name'
  }, {
    key: 1,
    title: '年龄',
    dataIndex: 'age'
  }]

  const data = [{
    name: '张三',
    age: 11
  }, {
    name: '李四',
    age: 12
  }]

  return (
    <div>
      <Table columns={columns}
            data={data}></Table>
    </div>
  )
}

export default DemoTable