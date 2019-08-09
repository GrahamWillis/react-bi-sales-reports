import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import DragIndicator from '@material-ui/icons/DragIndicator'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DoneIcon from '@material-ui/icons/Done'
import HighlightOff from '@material-ui/icons/HighlightOff'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Divider from '@material-ui/core/Divider'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import Report from './report'

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
    width: 200
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
            <Typography inline={'inline'} variant={'caption'} >{i.name}</Typography>
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
  const { dimension, dimensionItems, excluded, setExcluded, rowDimensions, colDimensions,
    setRowDimensions, setColDimensions } = props

  const classes = useStyles()
  const dragStart = e => {
    e.dataTransfer.setData('origin', 'DIMENSION')
    e.dataTransfer.setData('dimension', dimension.name)
  }

  const handleChange = (event, val) => {
    const { dimensions, setter, other: otherDimensions, otherSetter } = val === 'col'
      ? { dimensions: colDimensions, setter: setColDimensions, other: rowDimensions, otherSetter: setRowDimensions }
      : { dimensions: rowDimensions, setter: setRowDimensions, other: colDimensions, otherSetter: setColDimensions }

    if (dimensions.includes(dimension.name)) {
      setter(JSON.parse(JSON.stringify(dimensions.filter(d => dimension.name !== d))))
    } else {
      if (otherDimensions.includes(dimension.name)) {
        otherSetter(JSON.parse(JSON.stringify(otherDimensions.filter(d => dimension.name !== d))))
      }
      dimensions.push(dimension.name)
      setter(JSON.parse(JSON.stringify(dimensions)))
    }
  }

  return (<ExpansionPanel>

    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <div>
        <div className={classes.dimHeader}>
          <Typography inline={'true'} color={'primary'} variant={'subtitle1'} >{dimension.description}</Typography>
        </div>

        {rowDimensions.concat(colDimensions).includes(dimension.name) ||
        <Tooltip title='Drag to add to report' aria-label='Add'>
          <IconButton size='small' draggable='true' onDragStart={(e) => dragStart(e)}>
            <DragIndicator />
          </IconButton>
        </Tooltip>
        }
      </div>
    </ExpansionPanelSummary>

    <Divider />

    <ExpansionPanelDetails>
      <DimensionItems
        dimension={dimension}
        dimensionItems={dimensionItems}
        excluded={excluded}
        setExcluded={setExcluded}
      />
    </ExpansionPanelDetails>

    <Divider />
    <ExpansionPanelActions>
      <ToggleButtonGroup exclusive onChange={handleChange} size={'small'}>
        <ToggleButton value='row' size='small' selected={rowDimensions.includes(dimension.name)}>Row</ToggleButton>
        <ToggleButton value='col' size='small' selected={colDimensions.includes(dimension.name)}>Col</ToggleButton>
      </ToggleButtonGroup>
    </ExpansionPanelActions>

  </ExpansionPanel>)
}

const ControlDrawer = (props) => {
  const { dimensions, excluded, setExcluded, rowDimensions, setRowDimensions,
    colDimensions, setColDimensions, dimensionItems } = props

  return (
    <div>
      {dimensions.map((dim, i) =>
        <Dimension
          key={i}
          rowDimensions={rowDimensions}
          colDimensions={colDimensions}
          setRowDimensions={setRowDimensions}
          setColDimensions={setColDimensions}
          dimensionItems={dimensionItems}
          excluded={excluded}
          setExcluded={setExcluded}
          dimension={dim} />
      )}
    </div>
  )
}

export default ControlDrawer
