import ReactDOM from 'react-dom/client'
import router from './router/index.jsx'
import { Container } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './firebase/config'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container maxWidth="xl" sx={{ p: '0 !important' }}>
    <RouterProvider router={router} />
  </Container>
)
