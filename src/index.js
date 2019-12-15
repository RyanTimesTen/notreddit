const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');

const schema = require('./schema');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  context: ({ req }) => ({
    token: req.header('authorization').split('Bearer')[1],
  }),
  cors: true,
  tracing: DEV,
  introspection: DEV,
  playground: DEV
    ? {
        endpoint: '/graphql',
      }
    : false,
});

const app = express();

server.applyMiddleware({ app });

const http = createServer(app);
http.listen(PORT);
