import React from 'react'

const CellContainer = (WrappedComponent) => {
  return function (props) {
    const { rowDimensions, setRowDimensions, rowDimensionItems,
      colDimensions, setColDimensions, colDimensionItems, results } = props

    const add = (d, after, dimensions, setter) => {
      if (!dimensions.includes(d)) {
        if (after) {
          const posA = dimensions.findIndex(h => h === after)
          dimensions.splice(posA + 1, 0, d)
        } else {
          dimensions.push(d)
        }
      } else {
        if (after) {
          const posD = dimensions.findIndex(h => h === d)
          dimensions.splice(posD, 1)
          const posA = dimensions.findIndex(h => h === after)
          dimensions.splice(posA + 1, 0, d)
        }
      }
      setter(JSON.parse(JSON.stringify(dimensions)))
    }

    const addToCol = (d, after) => {
      add(d, after, colDimensions, setColDimensions)
    }

    const addToRow = (d, after) => {
      add(d, after, rowDimensions, setRowDimensions)
    }

    const removeCol = d => {
      setColDimensions(JSON.parse(JSON.stringify(colDimensions.filter(cd => d !== cd))))
    }

    const removeRow = d => {
      setRowDimensions(JSON.parse(JSON.stringify(rowDimensions.filter(rd => d !== rd))))
    }

    // This calculates the number of repetitions and the span of the set of dimension included
    // in a header to draw the table correctly
    const getRepetitions = (dimensions, dimensionItems) => {
      const result = {}
      let repetitions
      let span

      for (let i = 0; i < dimensions.length; i++) {
        span = 1
        repetitions = 1

        for (let j = i + 1; j < dimensions.length; j++) {
          span = dimensionItems[dimensions[j]] ? span * dimensionItems[dimensions[j]].length : span
        }

        if (span === 0) {
          span = 1
        }

        for (let j = i - 1; j >= 0; j--) {
          repetitions = dimensionItems[dimensions[j]] ? repetitions * dimensionItems[dimensions[j]].length : repetitions
        }

        result[dimensions[i]] = {
          span,
          repetitions
        }
      }

      return result
    }

    return (<WrappedComponent
      colDimensions={colDimensions}
      rowDimensions={rowDimensions}
      rowDimensionItems={rowDimensionItems}
      colDimensionItems={colDimensionItems}
      addToCol={addToCol}
      addToRow={addToRow}
      removeCol={removeCol}
      removeRow={removeRow}
      getRepetitions={getRepetitions}
      results={results} />)
  }
}

export default CellContainer
