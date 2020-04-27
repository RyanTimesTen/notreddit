import React from 'react';
import ReactDOM from 'react-dom';
import {
  createClient,
  Provider as UrqlProvider,
  Exchange,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from 'urql';
import { pipe, map } from 'wonka';

import { App } from './App';
import { AuthProvider, accessTokenKey } from './state';
import * as serviceWorker from './serviceWorker';
import './index.css';

const graphqlUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:9000/.netlify/functions/graphql'
    : 'https://snooql.app/.netlify/functions/graphql';

const authExchange: Exchange = ({ forward }) => ops$ =>
  pipe(
    ops$,
    map(op => {
      const fetchOptions =
        typeof op.context.fetchOptions === 'function'
          ? op.context.fetchOptions()
          : op.context.fetchOptions || {};

      op.context.fetchOptions = {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          authorization: `Bearer ${localStorage.getItem(accessTokenKey)}`,
        },
      };

      return op;
    }),
    forward
  );

const urqlClient = createClient({
  url: graphqlUrl,
  exchanges: [dedupExchange, cacheExchange, authExchange, fetchExchange],
});

ReactDOM.render(
  <UrqlProvider value={urqlClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </UrqlProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
