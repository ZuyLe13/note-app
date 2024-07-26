/* eslint-disable quotes */
import { Button, Typography } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import { graphQLRequest } from '../utils/request'

export default function Login() {
  const auth = getAuth()

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    const {
      user: { uid, displayName }
    } = await signInWithPopup(auth, provider)

    const { data } = await graphQLRequest({
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
    <>
      <Typography variant="h5" sx={{ marginBottom: '10px' }}>
        Welcome to Note App
      </Typography>
      <Button variant="outlined" onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </>
  )
}