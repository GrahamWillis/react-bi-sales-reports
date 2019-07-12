import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Paper from '@material-ui/core/Paper'
import DragIndicator from '@material-ui/icons/DragIndicator'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DoneIcon from '@material-ui/icons/Done'
import HighlightOff from '@material-ui/icons/HighlightOff'
import HomeIcon from '@material-ui/icons/Home'

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 300
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  paper: {
    display: 'flex',
    padding: theme.spacing(2),
    overflow: 'none',
    flexDirection: 'column',
    ...theme.mixins.gutters(),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  dimHeader: {
    display: 'inline-block',
    width: 155
  },
  itemName: {
    display: 'inline-block',
    width: 135
  }
}
))

function DimensionItems (props) {
  const { dimension, dimensionItems, excluded, setExcluded } = props
  const classes = useStyles()

  const handleClick = (e, item) => {
    e.preventDefault()
    if (excluded.find(e => e.id === item.id && e.dimension === dimension.name)) {
      setExcluded(JSON.parse(JSON.stringify(excluded.filter(e => e.id !== item.id || e.dimension !== dimension.name))))
    } else {
      excluded.push({ id: item.id, dimension: dimension.name })
      setExcluded(JSON.parse(JSON.stringify(excluded)))
    }
  }

  return (
    <List>
      {dimensionItems[dimension.name] && dimensionItems[dimension.name].map(i =>
        <ListItem key={i.id}>
          <div className={classes.itemName}>
            <Typography inline={'inline'} variant={'subtitle1'} >{i.name}</Typography>
          </div>

          <Tooltip title={excluded.find(e => e.id === i.id && e.dimension === dimension.name) ? 'Click to include' : 'Click to exclude'}>
            <IconButton color='primary' onClick={(e) => handleClick(e, i)}>
              {excluded.find(e => e.id === i.id && e.dimension === dimension.name) ? <HighlightOff /> : <DoneIcon />}
            </IconButton>
          </Tooltip>

        </ListItem>
      )}
    </List>
  )
}

function Dimension (props) {
  const { dimension, excluded, setExcluded, rowDimensions, colDimensions, dimensionItems } = props
  const classes = useStyles()
  const dragStart = e => {
    e.dataTransfer.setData('origin', 'DIMENSION')
    e.dataTransfer.setData('dimension', dimension.name)
  }

  return (<div>

    <div className={classes.dimHeader}>
      <Typography inline={'true'} color={'primary'} variant={'h5'} >{dimension.description}</Typography>
    </div>

    {rowDimensions.concat(colDimensions).includes(dimension.name) ||
    <Tooltip title='Drag to add to report' aria-label='Add'>
      <IconButton draggable='true' onDragStart={(e) => dragStart(e)}>
        <DragIndicator />
      </IconButton>
    </Tooltip>
    }

    <Divider />

    <DimensionItems
      dimension={dimension}
      dimensionItems={dimensionItems}
      excluded={excluded}
      setExcluded={setExcluded}
    />

  </div>)
}

const ControlDrawer = (props) => {
  const { dimensions, excluded, setExcluded, rowDimensions, colDimensions, dimensionItems, reset } = props

  const classes = useStyles()
  return (
    <Drawer variant='permanent' className={classes.drawerPaper}>
      <div className={classes.toolbarIcon} />
      <Divider />
      <Tooltip title='Click to reset'>
        <IconButton onClick={() => reset()}>
          <HomeIcon />
        </IconButton>
      </Tooltip>
      <Divider />
      {dimensions.map((dim, i) =>
        <Paper key={i} className={classes.paper} elevation={1}>
          <Dimension
            key={i}
            rowDimensions={rowDimensions}
            colDimensions={colDimensions}
            dimensionItems={dimensionItems}
            excluded={excluded}
            setExcluded={setExcluded}
            dimension={dim} />
        </Paper>
      )}
    </Drawer>
  )
}

export default ControlDrawer
