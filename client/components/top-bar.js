import React from 'react'
import { withStyles } from '@material-ui/core/styles/index'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: 300,
    width: 'calc(100% - 300px)'
  },
  toolBar: {
    paddingRight: 24
  }
})

const TopBar = (props) => {
  const { classes } = props

  return (
    <AppBar position='absolute' className={classes.toolBar}>
      <Toolbar className={classes.appBar}>
        <Typography variant='h6' color='inherit' >
            Sales Report
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(TopBar)
