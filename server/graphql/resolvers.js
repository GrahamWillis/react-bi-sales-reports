const { Fact, Dimension } = require('star-search')

const dimData = require('../model/dimensions')
const salesData = require('../model/sales')

const dimensions = {}

dimensions.colours = new Dimension('id', dimData.colour.items)
dimensions.sizes = new Dimension('id', dimData.size.items)
dimensions.styles = new Dimension('id', dimData.style.items)
dimensions.years = new Dimension('id', dimData.year.items)

const fact = new Fact(salesData, {
  colour: dimensions.colours,
  size: dimensions.sizes,
  style: dimensions.styles,
  year: dimensions.years
})

console.log(`Created ${fact.index.length} records`)

// const volume = results.reduce((a, c) => a + c.volume, 0)
const resultReducer = (aggregators, functionType, accumulator, current) => {
  const newEntry = (accumulator) => {
    accumulator.push(aggregators.reduce((a, c) => {
      const obj = {}
      obj[c] = current[c]
      return Object.assign(a, obj)
    }, { volume: current.volume }))
  }

  if (accumulator.length) {
    // Find if entry already exists
    const entry = accumulator.find(acc => {
      return aggregators.reduce((a, c) => {
        return a & acc[c] === current[c]
      }, true)
    })

    // Increment the volume of add new entry
    if (entry) {
      entry.volume += current.volume
    } else {
      newEntry(accumulator)
    }

    return accumulator
  } else {
    newEntry(accumulator)
    return accumulator
  }
}

const resolvers = {
  Query: {
    years: () => dimData.year.items,
    styles: () => dimData.style.items.map(i => Object.assign(i, { selected: true })),
    sizes: () => dimData.size.items.map(i => Object.assign(i, { selected: true })),
    colours: () => dimData.colour.items.map(i => Object.assign(i, { selected: true })),

    // Get by id
    // getYear: (parent, { id }) => dimData.year.items.find(i => i.id === id),

    // List the set of dimensions
    dimensions: () => {
      return Object.keys(dimData).map(k => {
        return {
          name: k,
          description: dimData[k].description
        }
      })
    },

    dimension: (_, { name }) => {
      return {
        name,
        description: dimData[name].description
      }
    },

    fact: (parent, { years, sizes, styles, colours, aggregators, functionType }) => {
      const searchObj = {}
      if (years) {
        searchObj.year = years
      }

      if (sizes) {
        searchObj.size = sizes
      }

      if (styles) {
        searchObj.style = styles
      }

      if (colours) {
        searchObj.colour = colours
      }

      const results = fact.search(searchObj)
      const rr = resultReducer.bind(this, aggregators, functionType)
      return { result: results.reduce(rr, []) }
    }
  }
}

module.exports = resolvers
