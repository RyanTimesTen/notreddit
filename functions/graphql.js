import { ApolloServer } from 'apollo-server-lambda';

import { typeDefs, resolvers } from './lib/schema';
import { createApi } from './lib/api';

// Workaround for node-fetch
// https://github.com/netlify/zip-it-and-ship-it/issues/67#issuecomment-549837499
require('encoding');

const DEV = process.env.NODE_ENV !== 'production';

const api = createApi();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // const token = (req.headers.authorization || '').split(' ')[1];
    // api.setAuth(token);
    // return { api };
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

exports.handler = server.createHandler();
