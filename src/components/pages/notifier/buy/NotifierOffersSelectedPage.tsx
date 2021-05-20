import React, {
  FC, useContext, useState,
} from 'react'

import {
  Collapse,
  Grid, makeStyles,
  Typography,
} from '@material-ui/core'
import { NotifierOffersContextProps as ContextProps, NotifierOffersContext } from 'context/Services/notifier/offers'
import { Button } from '@rsksmart/rif-ui'
import Marketplace from 'components/templates/marketplace/Marketplace'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import NotifierPlanDescription from 'components/organisms/notifier/NotifierPlanDescription'
import MarketContext, { MarketContextProps } from 'context/Market'
import TableContainer from '@material-ui/core/TableContainer'
import RemoveButton from 'components/atoms/RemoveButton'
import Tooltip from '@material-ui/core/Tooltip'
import { createStyles, Theme } from '@material-ui/core/styles'
import NotificationEventCreate from 'components/organisms/notifier/NotificationEventCreate'
import { NotifierEvent, NotifierEventParam } from 'models/marketItems/NotifierItem'
import Box from '@material-ui/core/Box'
import { SupportedEvent } from 'config/notifier'

const useStyles = makeStyles((theme: Theme) => createStyles({

  eventsSection: {
    marginTop: theme.spacing(4),
  },
}))

const eventHeaders = {
  name: 'Name',
  type: 'Type',
  channels: 'Channels',
  actions: '',
} as const

type EventItem = {
  [K in keyof Omit<typeof eventHeaders, 'actions'>]: string
} & {
  signature: string
}

const buildEventSignature = (notifierEvent: NotifierEvent): string => `${notifierEvent.name}(${notifierEvent?.params?.map((input: NotifierEventParam) => `${input.name} ${input.type}`).join(',')})`

const NotifierOffersSelectedPage: FC = () => {
  const classes = useStyles()
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: currentFiat,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  const {
    state: {
      order,
    },
    dispatch,
  } = useContext<ContextProps>(NotifierOffersContext)

  const [events, setEvents] = useState<Array<EventItem>>([])
  const [addEventCollapsed, setAddEventCollapsed] = useState<boolean>(false)
  const [key, setKey] = useState<number>(0)

  const addNotifierEvent = (notifierEvent: NotifierEvent): void => {
    if (notifierEvent.type === 'NEWBLOCK' as SupportedEvent && events.find((addedEvent) => addedEvent.type === 'NEWBLOCK' as SupportedEvent)) {
      setAddEventCollapsed(!addEventCollapsed)
      return
    }
    setEvents([
      ...events, {
        // id: notifierEvent.name as string,
        name: notifierEvent.type === 'NEWBLOCK' as SupportedEvent ? 'NEWBLOCK' : notifierEvent.name as string,
        type: notifierEvent.type,
        signature: notifierEvent.type === 'NEWBLOCK' as SupportedEvent ? '' : buildEventSignature(notifierEvent) as string,
        channels: notifierEvent.channels.map((channel) => channel.type).join('+'),
      },
    ])
    setAddEventCollapsed(!addEventCollapsed)
  }

  if (!order?.item) return null

  const removeEvent = (e) => {
    const newevents = events.filter((i) => i.name !== e.currentTarget.id)
    setEvents(newevents)
  }

  const collection = events.map((event) => ({
    name: <Tooltip title={event.signature}><Typography>{event.name}</Typography></Tooltip>,
    type: event.type,
    channels: event.channels,
    actions: <RemoveButton id={event.name} handleSelect={removeEvent} />,
  }))

  return (
    <CenteredPageTemplate>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          Notification plan selected
        </Typography>
      </Grid>
      <NotifierPlanDescription {...{ item: order.item, crypto, currentFiat }} />
      {/* Header */}
      <Grid item xs={11} md="auto" className={classes.eventsSection}>
        <Typography gutterBottom variant="h6" color="primary">
          Notification events added
        </Typography>
        <TableContainer>
          <Marketplace
            isLoading={false}
            items={collection}
            headers={eventHeaders}
            dispatch={dispatch}
          />
        </TableContainer>
      </Grid>

      <Button
        onClick={() => {
          setAddEventCollapsed(!addEventCollapsed)
          setKey(key + 1)
        }}
        variant="outlined"
        color="primary"
        rounded
      >
        + Add Notification Events
      </Button>
      <br />
      <br />
      <Collapse in={addEventCollapsed}>
        <Box mt={6}>
          <NotificationEventCreate key={key} onAddEvent={addNotifierEvent} channels={order?.item.channels} />
        </Box>
      </Collapse>
    </CenteredPageTemplate>
  )
}

export default NotifierOffersSelectedPage
