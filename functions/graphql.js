const { ApolloServer } = require('apollo-server-lambda');

const schema = require('./helpers/schema');
const { createApi } = require('./helpers/api');

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

exports.handler = server.createHandler();
