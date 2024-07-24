import { graphQLRequest } from './request'

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
    folder(folderId: $folderId) {
      id
      name
      notes {
        id
        content
      }
    }
  }`

  const data = await graphQLRequest({
    query,
    variables: {
      folderId
    }
  })

  return data
}

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Folder($noteId: String) {
    note(noteId: $noteId) {
      id
      content
    }
  }`

  const data = await graphQLRequest({
    query,
    variables: {
      noteId
    }
  })
  return data
}