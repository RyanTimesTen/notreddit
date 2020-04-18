import React from 'react';
import ReactDOM from 'react-dom';
import { createClient, Provider as UrqlProvider } from 'urql';

import { App } from './App';
import { AuthProvider } from './state';
import * as serviceWorker from './serviceWorker';
import './index.css';

const urqlClient = createClient({
  url: 'https://snooql.app/.netlify/functions/graphql',
  fetchOptions: {
    headers: {
      authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    },
  },
});

ReactDOM.render(
  <AuthProvider>
    <UrqlProvider value={urqlClient}>
      <App />
    </UrqlProvider>
  </AuthProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
