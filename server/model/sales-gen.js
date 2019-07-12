const fs = require('fs')
const dimensions = require('./dimensions')

const FACT_SIZE = 10000
const salesData = []

const colours = dimensions.colour.items
const sizes = dimensions.size.items
const styles = dimensions.style.items
const years = dimensions.year.items

for (let i = 0; i < FACT_SIZE; i++) {
  const sale = {}
  sale.id = i;
  sale.colour = colours[Math.round(Math.random() * (colours.length - 1))].id
  sale.size = sizes[Math.round(Math.random() * (sizes.length - 1))].id
  sale.style = styles[Math.round(Math.random() * (styles.length - 1))].id
  sale.year = years[Math.round(Math.random() * (years.length - 1))].id
  sale.volume = Math.round(Math.random() * 10000)
  salesData.push(sale)
}

// Write the file
fs.writeFileSync('./server/model/sales.json', JSON.stringify(salesData, null, 2))

console.log(`Generated sales data file of ${FACT_SIZE} records`)
