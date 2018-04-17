/**
 * 表格
 */
import React from 'react'
import PropTypes from 'prop-types'

import './index.less'

/**
 * 
 * const columns = {
    article: [{
      title: '标题',
      dataIndex: 'title'
    }, {
      title: '用户量',
      dataIndex: 'uv'
    }, {
      title: '阅读量',
      dataIndex: 'pv'
    }],
    date: [{
      title: '日期',
      dataIndex: 'date'
    }, {
      title: '用户量',
      dataIndex: 'uv'
    }, {
      title: '阅读量',
      dataIndex: 'pv',
      render: (pv) => {
        return <div></div>
      }
    }]
 */
const Table = ({ style, type, columns, data }) => {
  let columnTitles = [], // 用于thead
    dataIndexes = [], // 用于渲染tbody
    renderTable = {} // 当有条目传递了render字段，由该render控制对应td的显示
  columns.forEach(column => {
    columnTitles.push(column.title)
    dataIndexes.push(column.dataIndex)

    if (column.render) {
      renderTable[column.dataIndex] = column.render
    }
  })

  data = data || []
  return (
    <table className="cc-table" style={style}>
      <thead className="cc-table-thead">
        <tr>
          {/*渲染头部title*/}
          {columnTitles.map((title, i) => {
            return <th key={i}>{title}</th>
          })}
        </tr>
      </thead>

      <tbody className={`cc-table-tbody ${type || ''}`}>
        {/*渲染tbody数据*/}
        {data.map(item => {
          return (
            <tr key={item.key}>
              {dataIndexes.map(dataIndex => {
                // 将渲染控制权交由用户传递的render
                if (renderTable[dataIndex]) {
                  return (
                    <td key={dataIndex}>
                      {renderTable[dataIndex](item[dataIndex])}
                    </td>
                  )
                } else {
                  return <td key={dataIndex}>{item[dataIndex]}</td>
                }
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

Table.propTypes = {
  style: PropTypes.object, // 样式
  type: PropTypes.string, // 样式类型，可选：strip(条纹)，默认无样式
  columns: PropTypes.array, // 列的数据格式，参考ant-design
  data: PropTypes.array // 填充的数据的格式，参考ant-design
}

export default Table
