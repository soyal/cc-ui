import React from 'react'
import Table from 'table'
import 'table/index.css'

const DemoTable = () => {
  const columns = [{
    title: '姓名',
    dataIndex: 'name'
  }, {
    title: '年龄',
    dataIndex: 'age'
  }]

  const data = [{
    key: 0,
    name: '张三',
    age: 11
  }, {
    key: 1,
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