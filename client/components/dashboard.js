import React, { useState, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import { serverQuery, buildFactGrapQl } from '../api/graphql'
import ControlDrawer from './control-drawer'
import Report from './report'
import ReportBarChart from './bar-chart'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Tooltip from '@material-ui/core/Tooltip'
import HomeIcon from '@material-ui/icons/Home'
import { SizeMe } from 'react-sizeme'

const drawerWidth = 300

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}))

function Dashboard (props) {
  const [dimensions, setDimensions] = useState([])
  const [dimensionItems, setDimensionItems] = useState({})
  const [rowDimensions, setRowDimensions] = useState([])
  const [colDimensions, setColDimensions] = useState([])
  const [excluded, setExcluded] = useState([])
  const [results, setResults] = useState([])
  const [rowDimensionItems, setRowDimensionItems] = useState({})
  const [colDimensionItems, setColDimensionItems] = useState({})
  const [open, setOpen] = React.useState(true)

  const classes = useStyles()

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

  // Filter dimension items by the dimension name
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

  // Filter excluded dimension items
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

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='Open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
            BI Sales Report
          </Typography>
          <Tooltip title='Click to reset'>
            <IconButton color='inherit' onClick={() => reset()}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}>

        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />

        <ControlDrawer
          reset={reset}
          dimensions={dimensions}
          dimensionItems={dimensionItems}
          rowDimensions={rowDimensions}
          colDimensions={colDimensions}
          excluded={excluded}
          setExcluded={setExcluded}
        />

      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper>
                <Report
                  rowDimensions={rowDimensions}
                  setRowDimensions={setRowDimensions}
                  colDimensions={colDimensions}
                  setColDimensions={setColDimensions}
                  rowDimensionItems={filterExcluded(rowDimensionItems, excluded)}
                  colDimensionItems={filterExcluded(colDimensionItems, excluded)}
                  setExcluded={setExcluded}
                  results={results}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper}>
                <ReportBarChart
                  rowDimensionItems={filterExcluded(rowDimensionItems, excluded)}
                  colDimensionItems={filterExcluded(colDimensionItems, excluded)}
                  results={results}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default Dashboard
