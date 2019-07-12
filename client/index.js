import React from 'react'
import ReactDOM from 'react-dom'

import 'typeface-roboto'
import Dashboard from './components/dashboard'

/**
 * Top level render component
 */
function render () {
  ReactDOM.render(
    <div>
      <Dashboard />
    </div>,
    document.getElementById('root'))
}

render()
