import React from 'react'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Report from './report'

const styles = theme => ({
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    left: 300,
    position: 'absolute',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    minHeight: 300
  }
})

const Content = (props) => {
  const { classes } = props
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth='lg' className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <Typography component='h2' variant='h6' color='primary' gutterBottom>
                Sales by volume
              </Typography>
              <Report {...props} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={fixedHeightPaper}>
              <Typography component='h2' variant='h6' color='primary' gutterBottom>

              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={fixedHeightPaper}>
              <Typography component='h2' variant='h6' color='primary' gutterBottom>

              </Typography>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </main>
  )
}

export default withStyles(styles)(Content)
