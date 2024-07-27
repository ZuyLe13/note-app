import { useState } from 'react'
import NewFolder from './NewFolder'
import { deleteFolder } from '../utils/folderUtils'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Card, CardContent, List, Typography } from '@mui/material'

export default function FolderList({ folders }) {
  const { folderId } = useParams()
  const [activeFolderId, setActiveFolderId] = useState(folderId)
  const navigate = useNavigate()

  const handleDeleteFolder = async () => {
    await deleteFolder(folderId)
    navigate('/')
  }

  return (
    <List
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#7d9d9c',
        padding: '10px',
        textAlign: 'left',
        overflowY: 'auto'
      }}
      subheader={
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>
            Folders
          </Typography>
          <NewFolder />
        </Box>
      }
    >
      {folders.map(({ id, name }) => {
        return (
          <Box
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '&:hover': {
                '& .delete-icon': {
                  display: 'block'
                }
              }
            }}
          >
            <Link
              to={`folders/${id}`}
              onClick={() => setActiveFolderId(id)}
              style={{
                textDecoration: 'none',
                width: '100%'
              }}
            >
              <Card
                sx={{
                  mb: '5px',
                  backgroundColor: id === activeFolderId ? 'rgb(255 211 140)' : null
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    '&:last-child': { pb: '10px' },
                    padding: '10px'
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Typography>
                </CardContent>
              </Card>
            </Link>
            <Link
              to="/"
              style={{
                position: 'absolute',
                right: 16,
                padding: 1
              }}
            >
              <DeleteIcon
                color='error'
                className="delete-icon"
                sx={{
                  display: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleDeleteFolder}
              />
            </Link>
          </Box>
        )
      })}
    </List>
  )
}
