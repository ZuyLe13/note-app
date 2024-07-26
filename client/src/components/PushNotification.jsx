import { useEffect, useState } from 'react'
import { createClient } from 'graphql-ws'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { GRAPHQL_SUBSCRIPTION_ENDPOINT } from '../utils/constants';
import { Badge, Menu, MenuItem } from '@mui/material'

const client = createClient({
  url: GRAPHQL_SUBSCRIPTION_ENDPOINT
})

const query = `subscription PushNotification {
  notification {
    message
  }
}`

export default function PushNotification() {
  const [invisible, setInvisible] = useState(true)
  const [notification, setNotification] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
    setNotification('')
    setInvisible(true)
  }

  const handleClick = (e) => {
    if (notification) {
      setAnchorEl(e.currentTarget)
    }
  }

  useEffect(() => {
    (async () => {
      const subscription = client.iterate({
        query
      })
      for await (const event of subscription) {
        setInvisible(false)

        const message = event?.data?.notification?.message
        setNotification(message)
        break
      }
    })()

  }, [])

  return (
    <>
      <Badge color='primary' variant='dot' invisible={invisible}>
        <NotificationsIcon onClick={handleClick} />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{notification}</MenuItem>
      </Menu>
    </>
  )
}
