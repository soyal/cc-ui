import React from 'react'
import Table from '../../src/table'

const DemoTable = () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age'
    }
  ]

  const data = [
    {
      key: 1,
      name: '张三',
      age: 11
    },
    {
      key: 2,
      name: '李四',
      age: 12
    }
  ]

  return (
    <div>
      <h3>有数据的情况</h3>
      <Table columns={columns} data={data} />

      <h3>无数据的情况</h3>
      <Table columns={columns} data={[]} />
    </div>
  )
}

export default DemoTable
