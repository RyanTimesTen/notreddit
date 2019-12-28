import { ApolloServer } from 'apollo-server-lambda';

import { typeDefs, resolvers } from './helpers/schema';
import { createApi } from './helpers/api';

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
