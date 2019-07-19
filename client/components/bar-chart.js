import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { withSize } from 'react-sizeme'

const ReportBarChart = (props) => {
  const { width, height } = props.size
  const { rowDimensionItems, colDimensionItems, results } = props

  const data = []
  const keys = []
  const dimensionItems = Object.assign({}, rowDimensionItems, colDimensionItems)
  const colours = ['#cccf63', '#448ca9', '#1811ad', '#9b3228', '#d78988', '#9de213', '#aab8aa', '#043a2e',
    '#12a901', '#19bc58', '#4db6d6', '#a3c312', '#1ab5ab', '#c0266a', '#b472ac', '#6d63fe', '#a8f609',
    '#9fe290', '#9f5169', '#9da66e', '#988bcf', '#721ad5', '#b7c388', '#84a6b8', '#7eb495']

  if (Object.keys(dimensionItems).includes('year')) {
    if (Object.keys(dimensionItems).length > 1) {
      dimensionItems.year.map(year => {
        const datum = {}
        datum.name = year.name
        Object.keys(dimensionItems).filter(dim => dim !== 'year').forEach(dim => {
          dimensionItems[dim].forEach(item => {
            datum[item.name] = results.result.filter(r => r[dim] === item.id && r.year === year.id).reduce((a, c) => a + c.volume, 0)
            if (!keys.find(k => k.dataKey === item.name && k.stackId === dim)) {
              keys.push({ dataKey: item.name, stackId: dim, colour: colours.pop() })
            }
          })
        })
        data.push(datum)
      })
    } else {
      dimensionItems.year.map(year => {
        const datum = {}
        datum.name = year.name
        datum.volume = results.result.filter(r => r.year === year.id).reduce((a, c) => a + c.volume, 0)
        data.push(datum)
      })
      keys.push({ dataKey: 'volume', stackId: 'a', colour: colours.pop() })
    }
  } else {
    if (Object.keys(dimensionItems).length) {
      const datum = {}
      datum.name = 'total'
      Object.keys(dimensionItems).forEach(dim => {
        dimensionItems[dim].forEach(item => {
          datum[item.name] = results.result.filter(r => r[dim] === item.id).reduce((a, c) => a + c.volume, 0)
          if (!keys.find(k => k.dataKey === item.name && k.stackId === dim)) {
            keys.push({ dataKey: item.name, stackId: dim, colour: colours.pop() })
          }
        })
      })
      data.push(datum)
    } else {
      const datum = {}
      datum.name = 'total'
      datum.volume = results.result && results.result.length ? results.result[0].volume.toLocaleString() : 0
      data.push(datum)
      keys.push({ dataKey: 'volume', stackId: 'a', colour: colours.pop() })
    }
  }

  return (
    <BarChart
      data={data}
      width={width}
      height={height}
      margin={{
        top: 20, right: 30, left: 20, bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      {keys.map((k, idx) => <Bar key={idx} dataKey={k.dataKey} stackId={k.stackId} fill={k.colour} />)}
    </BarChart>
  )
}

export default withSize({ monitorHeight: true })(ReportBarChart)
