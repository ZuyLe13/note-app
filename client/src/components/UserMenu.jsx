import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material'

export default function UserMenu() {
  const { user: { displayName, photoUrl, auth } } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleLogout = () => {
    auth.signOut()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  return (
    <>
      <Box
        sx={{ display: 'flex' }}
        onClick={handleClick}
      >
        <Typography>{displayName}</Typography>
        <Avatar
          alt="avatar"
          src={photoUrl}
          sx={{ width: 24, height: 24, ml: '5px' }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}
