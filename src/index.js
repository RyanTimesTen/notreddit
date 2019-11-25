const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');

const schema = require('./schema');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
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
const http = createServer(app);

server.applyMiddleware({ app });

http.listen(PORT);
