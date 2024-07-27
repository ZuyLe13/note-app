import { graphQLRequest } from './request'

export const foldersLoader = async () => {
  const query = `query Folders {
    folders {
      id
      name
      createdAt
    }
  }`

  const data = await graphQLRequest({ query })
  return data
}

export const addNewFolder = async (newFolder) => {
  const query = `mutation Mutation($name: String!) {
    addFolder(name: $name) {
      name
      author {
        name
      }
    }
  }`

  const data = await graphQLRequest({
    query,
    variables: { name: newFolder.name }
  })

  return data
}

export const deleteFolder = async (folderId) => {
  const query = `mutation Mutation($folderId: ID!) {
    deleteFolder(folderId: $folderId) {
      id
    }
  }`

  const data = await graphQLRequest({
    query,
    variables: { folderId }
  })

  return data
}
