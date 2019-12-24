const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');

const schema = require('./schema');
const { createApi } = require('./api');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const api = createApi();

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  context: ({ req }) => {
    const token = (req.headers.authorization || '').split(' ')[1];
    api.setAuth(token);
    return { api };
  },
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
