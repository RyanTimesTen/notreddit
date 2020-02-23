import React from 'react';
import ReactDOM from 'react-dom';
import { createClient, Provider } from 'urql';

import './index.css';
import { App } from './App';
import * as serviceWorker from './serviceWorker';

const urqlClient = createClient({
  url: 'https://snooql.app/.netlify/functions/graphql',
  fetchOptions: {
    headers: {
      authorization: 'Bearer 61936739-EJY4OzbQVfbXxV34kYKtJZMKwQ0',
    },
  },
});

console.log({ urqlClient });

ReactDOM.render(
  <Provider value={urqlClient}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
