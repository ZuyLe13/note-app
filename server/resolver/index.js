import fakeData from '../fakeData/index.js'
import { AuthorModel, FolderModel } from '../models/index.js'

export const resolvers = {
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({
        authorId: context.uid
      }).sort({
        updatedAt: 'desc'
      })
      return folders
    },
    folder: async (parent, args) => {
      const folderId = args.folderId
      const foundFolder = await FolderModel.findOne({
        _id: folderId
      })
      return foundFolder
    },
    note: (parent, args) => {
      const noteId = args.noteId
      return fakeData.notes.find(note => note.id === noteId)
    }
  },
  Folder: {
    author: async (parent, args) => {
      const authorId = parent.authorId
      const author = await AuthorModel.findOne({
        uid: authorId
      })
      return author
    },
    notes: (parent, args) => {
      return fakeData.notes.filter(note => note.folderId === parent.id)
    }
  },

  Mutation: {
    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context.uid })
      await newFolder.save()
      return newFolder
    },
    register: async (parent, args) => {
      const foundUser = new AuthorModel.findOne({ uid: args.uid })

      if (!foundUser) {
        const newUser = new AuthorModel(args)
        await newUser.save()
        return newUser
      }

      return foundUser
    }
  }
}