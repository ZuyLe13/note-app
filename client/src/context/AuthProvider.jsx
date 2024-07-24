import { createContext, useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

// Lưu trữ thông tin người dùng

export const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth()

  useEffect(() => {
    const unsubscribed = auth.onIdTokenChanged(user => {
      console.log('🚀 From AuthProvider:', { user })

      if (user?.uid) {
        setUser(user)

        if (user.accessToken !== localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', user.accessToken)
          window.location.reload()
        }

        setIsLoading(false)
        return
      }

      // Reset user info / Logout
      setIsLoading(false)
      setUser({})
      localStorage.clear()
      navigate('/login')
    })

    return () => {
      unsubscribed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  )
}
