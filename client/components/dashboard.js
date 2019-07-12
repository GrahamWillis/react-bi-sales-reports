import React, { useState, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles/index'
import { serverQuery, buildFactGrapQl } from '../api/graphql'
import TopBar from './top-bar'
import ControlDrawer from './control-drawer'
import Content from './content'

const styles = () => ({
  root: {
    flexGrow: 1
  }
})

function Dashboard (props) {
  const [dimensions, setDimensions] = useState([])
  const [dimensionItems, setDimensionItems] = useState({})
  const [rowDimensions, setRowDimensions] = useState([])
  const [colDimensions, setColDimensions] = useState([])
  const [excluded, setExcluded] = useState([])
  const [results, setResults] = useState([])
  const [rowDimensionItems, setRowDimensionItems] = useState({})
  const [colDimensionItems, setColDimensionItems] = useState({})
  const { classes } = props

  const setDimensionItemsFor = dimension => {
    return (items) => {
      dimensionItems[dimension] = items
      setDimensionItems(JSON.parse(JSON.stringify(dimensionItems)))
    }
  }

  const reset = () => {
    setRowDimensions([])
    setColDimensions([])
    setExcluded([])
  }

  // Fetch the initial dimension data
  useEffect(() => {
    (async () => {
      await serverQuery('{ dimensions { name description } }', setDimensions, (r) => r.data.data.dimensions)
    })()
  }, [])

  // Fetch the dimension item data
  useEffect(() => {
    (async () => {
      await Promise.all(dimensions.map(async dimension => {
        await serverQuery('{ ' + dimension.name + 's { id name }}', setDimensionItemsFor(dimension.name), (r) => r.data.data[dimension.name + 's'])
      }))
    })()
  }, [dimensions, excluded])

  const filterDimensionItems = (dim) => Object.assign({}, Object.keys(dimensionItems).filter(r => dim.includes(r)).reduce((o, k) => {
    return {
      ...o,
      [k]: dimensionItems[k]
    }
  }, {}))

  // Fetch the current selected data and the result
  useEffect(() => {
    (async () => {
      setColDimensionItems(filterDimensionItems(colDimensions))
      setRowDimensionItems(filterDimensionItems(rowDimensions))
      const factQl = await buildFactGrapQl(rowDimensions, colDimensions, excluded)
      await serverQuery(factQl, setResults, (r) => r.data.data.fact)
    })()
  }, [colDimensions, rowDimensions, excluded])

  const filterExcluded = (dimensionItems, excluded) => {
    if (!dimensionItems) {
      return []
    }

    const filtered = {}
    Object.keys(dimensionItems).forEach(dimension => {
      filtered[dimension] = JSON.parse(JSON.stringify(dimensionItems[dimension]
        .filter(d => !excluded.find(e => e.dimension === dimension && e.id === d.id))))
    })

    return filtered
  }

  if (!dimensions || !dimensionItems || !colDimensions || !rowDimensions || !rowDimensionItems || !colDimensionItems) {
    return (<div>Fetching...</div>)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopBar />

      <ControlDrawer
        reset={reset}
        dimensions={dimensions}
        dimensionItems={dimensionItems}
        rowDimensions={rowDimensions}
        colDimensions={colDimensions}
        excluded={excluded}
        setExcluded={setExcluded}
      />

      <Content
        rowDimensions={rowDimensions}
        setRowDimensions={setRowDimensions}
        colDimensions={colDimensions}
        setColDimensions={setColDimensions}
        rowDimensionItems={filterExcluded(rowDimensionItems, excluded)}
        colDimensionItems={filterExcluded(colDimensionItems, excluded)}
        setExcluded={setExcluded}
        results={results}
      />

    </div>
  )
}

export default withStyles(styles)(Dashboard)
