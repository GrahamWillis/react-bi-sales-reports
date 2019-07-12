import axios from 'axios/index'

const graphUrl = () => {
  const url = new URL(`${window.location.protocol}//${window.location.host}/graphql`)
  return url.href
}

const serverQuery = async (queryStr, setter, resultFnc) => {
  try {
    const payload = { query: queryStr }

    const result = await axios({
      method: 'post',
      url: graphUrl(),
      data: payload,
      headers: { 'content-type': 'application/json' }
    })

    setter(resultFnc(result))
  } catch (err) {
    console.error(err)
  }
}

const buildFactGrapQl = async (rowDimensions, colDimensions, excluded) => {
  // Build the data query
  const dims = rowDimensions.concat(colDimensions)

  const dimItems = await Promise.all(dims.map(async d => {
    const gql = '{ ' + d + 's { id name }}'
    const payload = { query: gql }
    const result = await axios({
      method: 'post',
      url: graphUrl(),
      data: payload,
      headers: { 'content-type': 'application/json' }
    })
    const items = result.data.data[d + 's']
    const filtered = items.filter(i => !excluded.find(e => i.id === e.id && e.dimension === d))
    return { dimension: d, items: filtered }
  }))

  const factStr = dimItems.length
    ? dimItems.filter(d => d.items.length)
      .map(d => `${d.dimension}s: [${d.items.map(i => i.id).join(',')}]`)
      .join(',') +
    ' aggregators: [' + dimItems.filter(d => d.items.length).map(d => `"${d.dimension}"`)
      .join(',') + ']'
    : 'aggregators: []'

  const resultStr = dimItems.filter(d => d.items.length).map(d => `${d.dimension}`).join('\n')

  return `
       query {
         fact(${factStr}) {
           result {
              volume
              ${resultStr}
           }
         }
       }
     `
}

export { serverQuery, buildFactGrapQl }
