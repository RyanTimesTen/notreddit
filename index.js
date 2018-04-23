import express from 'express';
import graphqlHTTP from 'express-graphql';

import schema from './src/schema';

const app = express();
app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: { token: req.header('token') },
  })),
);

const port = 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});
