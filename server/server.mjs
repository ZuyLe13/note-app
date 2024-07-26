import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import './firebaseConfig.js'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './schemas/index.js'
import { resolvers } from './resolver/index.js'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { getAuth } from 'firebase-admin/auth'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express()
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 4000
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@note-app.rrqyphc.mongodb.net/?retryWrites=true&w=majority&appName=note-app`

const schema = makeExecutableSchema({ typeDefs, resolvers })

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
})

await server.start()

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1]
    getAuth()
      .verifyIdToken(accessToken)
      .then(decodedToken => {
        res.locals.uid = decodedToken.uid
        next()
      })
      .catch(err => {
        console.log({ err })
        return res.status(403).json({ message: 'Forbidden', error: err })
      })
  } else {
    // return res.status(401).json({ message: 'Unauthorized' })
    next()
  }
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
  context: async ({ req, res }) => {
    return { uid: res.locals.uid }
  }
}))

mongoose.set('strictQuery', false)
mongoose
  .connect(URI)
  .then(async () => {
    console.log('🚀 Successfully connected to MongoDB!')
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })