import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Outlet, useLoaderData } from 'react-router-dom'
import FolderList from '../components/FolderList'
import UserMenu from '../components/UserMenu'
import PushNotification from '../components/PushNotification'

export default function Home() {
  const { folders } = useLoaderData()

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: 'auto'
      }}
    >
      <Typography
        variant='h4'
        sx={{
          mb: '20px',
          pt: '40px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        NOTE APP
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'right',
          mb: '10px',
        }}
      >
        <UserMenu />
        <PushNotification />
      </Box>

      <Grid
        container
        sx={{
          height: '60vh',
          boxShadow: '0 0 15px 0 rgb(193 193 193 / 60%)'
        }}
      >
        <Grid item xs={3} sx={{ height: '100%' }}>
          <FolderList folders={folders} />
        </Grid>
        <Grid item xs={9} sx={{ height: '100%', backgroundColor: 'white' }}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  )
}