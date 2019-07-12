import React from 'react'
import Button from '@material-ui/core/Button'
import ClearAllIcon from '@material-ui/icons/ClearAll'
import styles from './styles'
import { withStyles } from '@material-ui/core/styles'

class ClearAll extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <Button variant='contained' color={'primary'} className={classes.clearAll}>
        <ClearAllIcon />
      </Button>
    )
  }
}

export default withStyles(styles)(ClearAll)
