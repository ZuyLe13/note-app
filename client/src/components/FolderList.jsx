import { useState } from 'react'
import NewFolder from './NewFolder'
import { Link, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Card, CardContent, List, Typography } from '@mui/material'

export default function FolderList({ folders }) {
  const { folderId } = useParams()
  const [activeFolderId, setActiveFolderId] = useState(folderId)

  const handleClick = () => {
    console.log(123)
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
          <Link
            key={id}
            to={`folders/${id}`}
            style={{
              textDecoration: 'none'
            }}
            onClick={() => setActiveFolderId(id)}
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
                  padding: '10px',
                  '&:hover': {
                    '& .delete-icon': {
                      display: 'block'
                    }
                  }
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Typography>
                <DeleteIcon
                  color='error'
                  className="delete-icon"
                  sx={{ display: 'none' }}
                  onClick={handleClick}
                />
              </CardContent>

            </Card>

          </Link>
        )
      })}
    </List>
  )
}
