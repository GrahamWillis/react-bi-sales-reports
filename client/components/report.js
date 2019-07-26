import React, { useCallback } from 'react'
import Table from '@material-ui/core/Table'
import CellContainer from './cell-container'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles/index'

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 200
  }
}))

const ColHeaderRow = props => {
  const { items, repetition } = props

  if (!items) {
    return (<TableCell />)
  }

  return [...Array(repetition.repetitions).keys()].map(() => {
    return items.map((i, k) => <Tooltip key={k} title='Click to remove'><TableCell colSpan={repetition.span} key={k}>{i.name}</TableCell></Tooltip>)
  })
}

function Col (props) {
  const { rowDimensions, rowDimensionItems, colDimensions, addToRow, removeCol, removeRow, getRepetitions } = props

  const drop = (e, after) => {
    e.preventDefault()
    if (after) {
      e.stopPropagation()
    }

    const origin = e.dataTransfer.getData('origin')
    const dimension = e.dataTransfer.getData('dimension')

    addToRow(dimension, after)

    if (origin === 'COL') {
      removeCol(dimension)
    }
  }

  const dragStart = (e, d) => {
    e.dataTransfer.setData('origin', 'ROW')
    e.dataTransfer.setData('dimension', d)
  }

  if (!rowDimensions.length) {
    return <TableHead>
      <TableRow
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => drop(e)}>
        {colDimensions.map(c => { return <TableCell key={'spacer_' + c} /> })}
        <TableCell /><TableCell><Typography variant='caption' color='inherit' >Drop columns here</Typography></TableCell>
      </TableRow>
    </TableHead>
  }

  return <TableHead>
    {rowDimensions.map((d, k) =>
      <TableRow key={k}
        onClick={() => removeRow(d)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => drop(e, d)}
        draggable='true' onDragStart={(e) => dragStart(e, d)}
      >
        {colDimensions.length ? colDimensions.map(c => { return <TableCell key={'spacer_' + c} /> }) : <TableCell /> }
        <ColHeaderRow
          dimension={d}
          items={rowDimensionItems[d]}
          repetition={getRepetitions(rowDimensions, rowDimensionItems)[d]}
        />
      </TableRow>
    )}
  </TableHead>
}

const RowDetail = props => {
  const { cDimensions, rowNum, removeCol, drop } = props

  const dragStart = (e, d) => {
    e.dataTransfer.setData('origin', 'COL')
    e.dataTransfer.setData('dimension', d)
  }

  return cDimensions.map((dimension, k) => {
    if (!dimension.items) {
      return <TableCell key={k} />
    }

    const idx = Math.floor(rowNum / dimension.span) % dimension.items.length
    if (rowNum % dimension.span === 0) {
      return (<Tooltip key={k} title='Click to remove'><TableCell
        rowSpan={dimension.span}
        key={k}
        onClick={() => removeCol(dimension.name)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => drop(e, dimension.name)}
        draggable='true' onDragStart={(e) => dragStart(e, dimension.name)}
      >
        {dimension.items[idx].name}
      </TableCell></Tooltip>)
    }
  })
}

const RowData = props => {
  const { cDimensions, rDimensions, rowNum, rowIterator, results } = props

  // Calculate the horizontal dimensionality for the result-set fetch
  const cDimensionality = cDimensions.map(dimension => {
    return dimension.items
      ? Object.assign({}, {
        name: dimension.name,
        id: dimension.items[Math.floor(rowNum / dimension.span) % dimension.items.length].id })
      : {}
  })

  // Calculate the vertical dimensionality for the result-set fetch
  const rDimensionality = rowIterator ? rowIterator().map(rn => {
    return rDimensions.map(dimension => {
      return dimension.items ? Object.assign({}, {
        name: dimension.name,
        id: dimension.items[Math.floor(rn / dimension.span) % dimension.items.length].id }) : {}
    })
  }) : []

  return rDimensionality.map((rdim, k) => {
    const term = rdim.concat(cDimensionality).reduce((acc, c) => {
      const res = {}
      res[c.name] = c.id
      return Object.assign(acc, res)
    }, {})

    const result = results.result.find(f => Object.keys(term).every(t => f[t] === term[t]))
    return (<TableCell key={k}>{ result ? result.volume.toLocaleString() : ''}</TableCell>)
  })
}

function RowsAndData (props) {
  const {
    rowDimensions, rowDimensionItems, colDimensions, colDimensionItems,
    removeRow, removeCol, addToCol, getRepetitions, results
  } = props

  const drop = (e, after) => {
    e.preventDefault()

    if (after) {
      e.stopPropagation()
    }

    const origin = e.dataTransfer.getData('origin')
    const dimension = e.dataTransfer.getData('dimension')

    addToCol(dimension, after)

    if (origin === 'ROW') {
      removeRow(dimension)
    }
  }

  const colIterator = useCallback(
    () => {
      let acc = 1

      Object.keys(colDimensionItems)
        .forEach(d => { acc = acc * colDimensionItems[d].length })

      return [...Array(acc).keys()]
    },
    [colDimensionItems]
  )

  const rowIterator = useCallback(
    () => {
      if (!rowDimensionItems) {
        return []
      }

      let acc = 1

      Object.keys(rowDimensionItems)
        .forEach(d => { acc = acc * rowDimensionItems[d].length })

      return [...Array(acc).keys()]
    },
    [rowDimensionItems]
  )

  const cDimensions = colDimensions.map(d => Object.assign({
    name: d,
    span: getRepetitions(colDimensions, colDimensionItems)[d].span,
    items: colDimensionItems ? colDimensionItems[d] : []
  }))

  const rDimensions = rowDimensions.map(d => Object.assign({
    name: d,
    span: rowDimensionItems ? getRepetitions(rowDimensions, rowDimensionItems)[d].span : 0,
    items: rowDimensionItems ? rowDimensionItems[d] : []
  }))

  if (!colDimensions.length) {
    return (
      <TableBody
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => drop(e)}>
        <TableRow>
          <TableCell>
            <Typography variant='caption' color='inherit' >Drop rows here</Typography>
          </TableCell>
          {Object.keys(rowDimensionItems).length ? <RowData
            rowNum={1}
            cDimensions={cDimensions}
            rDimensions={rDimensions}
            rowIterator={rowIterator}
            results={results}
          /> : <TableCell>{results.result && results.result.length ? results.result[0].volume.toLocaleString() : 0}</TableCell>}
        </TableRow>
      </TableBody>)
  }

  return (
    <TableBody
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => drop(e)}
    >

      {colIterator().map(rowNum =>
        <TableRow
          key={rowNum}
        >
          <RowDetail
            rowNum={rowNum}
            cDimensions={cDimensions}
            removeCol={removeCol}
            drop={drop}
          />
          <RowData
            rowNum={rowNum}
            cDimensions={cDimensions}
            rDimensions={rDimensions}
            rowIterator={rowIterator}
            results={results}
          />
        </TableRow>
      )}

    </TableBody>
  )
}

const RowHeaderAndData = CellContainer(RowsAndData)
const ColumnHeaders = CellContainer(Col)

const Report = (props) => {
  const { rowDimensions, setRowDimensions, rowDimensionItems,
    colDimensions, setColDimensions, colDimensionItems, results } = props

  const classes = useStyles()

  return (
    <Table className={classes.table}>
      <ColumnHeaders
        rowDimensions={rowDimensions}
        setRowDimensions={setRowDimensions}
        colDimensions={colDimensions}
        setColDimensions={setColDimensions}
        rowDimensionItems={rowDimensionItems}
      />

      <RowHeaderAndData
        rowDimensions={rowDimensions}
        setRowDimensions={setRowDimensions}
        colDimensions={colDimensions}
        setColDimensions={setColDimensions}
        colDimensionItems={colDimensionItems}
        rowDimensionItems={rowDimensionItems}
        results={results}
      />
    </Table>)
}

export default Report
