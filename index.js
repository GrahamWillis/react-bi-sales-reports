'use strict'

const Path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const { ApolloServer } = require('apollo-server-hapi')

const typeDefs = require('./server/graphql/typedefs')
const resolvers = require('./server/graphql/resolvers')

const app = new Hapi.Server({
  port: 8080,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'dist')
    }
  }
})

;(async () => {
  await app.register(Inert)

  app.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  })

  app.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return h.redirect('/start.html')
    }
  })

  const apolloServer = new ApolloServer({ typeDefs,
    resolvers,
    context: async ({ request }) => {
      //  console.log(request.payload.query)
    } })

  await apolloServer.applyMiddleware({ app })
  await apolloServer.installSubscriptionHandlers(app.listener)

  await app.start()
  console.log('Server running at:', app.info.uri)
})()
