import React from 'react';
import ReactDOM from 'react-dom';
import { createClient, Provider as UrqlProvider } from 'urql';

import { App } from './App';
import { AuthProvider } from './state';
import * as serviceWorker from './serviceWorker';
import { graphqlUrl } from './constants';
import './index.css';
import { getToken } from './utils';

const urqlClient = createClient({
  url: graphqlUrl,
  fetchOptions: () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }),
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
