import { GraphQLScalarType, subscribe } from 'graphql'
import { AuthorModel, FolderModel, NoteModel, NotificationModel } from '../models/index.js'
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub()

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value)
    },
    serialize(value) {
      return value.toISOString()
    }
  }),
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
      const foundFolder = await FolderModel.findById(folderId)
      return foundFolder
    },
    note: async (parent, args) => {
      const noteId = args.noteId
      const note = await NoteModel.findById(noteId)
      return note
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
    notes: async (parent, args) => {
      const notes = await NoteModel.find({
        folderId: parent.id
      }).sort({
        updatedAt: 'desc'
      })
      return notes
    }
  },
  Mutation: {
    addNote: async (parent, args) => {
      const newNote = new NoteModel(args)
      await newNote.save()
      return newNote
    },
    updateNote: async (parent, args) => {
      const noteId = args.id
      const note = await NoteModel.findByIdAndUpdate(noteId, args)
      return note
    },
    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context.uid })
      pubsub.publish('FOLDER_CREATED', {
        folderCreated: {
          message: 'A new folder created'
        }
      })
      await newFolder.save()
      return newFolder
    },
    deleteFolder: async (parent, args) => {
      await NoteModel.deleteMany({ folderId: args.folderId })
      const deletedFolder = await FolderModel.findByIdAndDelete(args.folderId)

      return deletedFolder
    },
    register: async (parent, args) => {
      const foundUser = new AuthorModel.findOne({ uid: args.uid })

      if (!foundUser) {
        const newUser = new AuthorModel(args)
        await newUser.save()
        return newUser
      }
      console.log('🚀 ~ register: ~ foundUser:', foundUser)
      return foundUser
    },
    pushNotification: async (parent, args) => {
      const newNotification = new NotificationModel(args)

      pubsub.publish('PUSH_NOTIFICATION', {
        notification: {
          message: args.content
        }
      })

      await newNotification.save()
      return { message: 'SUCCESS' }
    }
  },

  Subscription: {
    folderCreated: {
      subscribe: () => pubsub.asyncIterator(['FOLDER_CREATED', 'NOTE_CREATED'])
    },
    notification: {
      subscribe: () => pubsub.asyncIterator(['PUSH_NOTIFICATION'])
    },
    folderDeleted: {
      subscribe: () => pubsub.asyncIterator(['FOLDER_DELETED'])
    }
  }
}