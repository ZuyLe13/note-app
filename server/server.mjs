import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './schemas/index.js'
import { resolvers } from './resolver/index.js'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { getAuth } from 'firebase-admin/auth'
import './firebaseConfig.js'

const app = express()
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 4000
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@note-app.rrqyphc.mongodb.net/?retryWrites=true&w=majority&appName=note-app`

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1]
    getAuth().verifyIdToken(accessToken)
      .then(decodedToken => {
        res.locals.uid = decodedToken.uid
        next()
      })
      .catch(err => {
        console.log({ err })
        return res.status(403).json({ message: 'Forbidden', error: err })
      })
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
  context: async ({ req, res }) => {
    return { uid: res.locals.uid }
  }
}))

mongoose.set('strictQuery', false)
mongoose.connect(URI).then(async () => {
  console.log('🚀 Successfully connected to MongoDB!')
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})