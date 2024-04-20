const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
connectToMongoDB();
//mongoose.set('debug', true);

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
  ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            );
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          } catch (error) {
            console.error('Error verifying JWT:', error);
            throw new Error('Invalid or expired token');
          }
        }
      }
    })
  )
  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()