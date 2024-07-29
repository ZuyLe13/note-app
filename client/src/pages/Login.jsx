/* eslint-disable quotes */
import { Box, Button, Typography } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import { graphQLRequest } from '../utils/request'
import imageFile from '../assets/img.jpg'

export default function Login() {
  const auth = getAuth()

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    const {
      user: { uid, displayName }
    } = await signInWithPopup(auth, provider)

    await graphQLRequest({
      query: `mutation register($uid: String!, $name: String!) {
        register(uid: $uid, name: $name) {
          uid
          name
        }
      }`,
      variables: {
        uid,
        name: displayName
      }
    })
  }

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/" />
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100vh',
      backgroundImage: `url(${imageFile})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          color: 'white',
          textTransform: 'uppercase'
        }}
      >
        Welcome to Note App
      </Typography>
      <Button
        size="large"
        variant="contained"
        onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </Box>
  )
}