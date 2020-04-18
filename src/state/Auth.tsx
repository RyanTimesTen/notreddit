import * as React from 'react';

interface IAuthContext {
  handleLogin(): void;
}

export const AuthContext = React.createContext<IAuthContext>({
  handleLogin: () => {},
});

const authorizationUrl = 'https://www.reddit.com/api/v1/authorize';
const accessTokenUrl = 'https://www.reddit.com/api/v1/access_token';

const clientId = process.env.REACT_APP_CLIENT_ID || '';
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || '';
const redirectUri = process.env.REACT_APP_REDIRECT_URI || '';

// https://gist.github.com/6174/6062387
const getRandomString = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type QueryParams = { [key: string]: string };

export const paramefy = (queryParams: QueryParams) => {
  return Object.entries(queryParams).reduce(
    (acc, [key, value], index) => (acc += `${index === 0 ? '' : '&'}${key}=${value}`),
    ''
  );
};

export const deparamefy = (urlString: string): QueryParams => {
  if (urlString.includes('?')) {
    urlString = urlString.split('?')[1];
  }

  return urlString.split('&').reduce((acc, next) => {
    const [key, value] = next.split('=');
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

export const AuthProvider: React.FC = ({ children }) => {
  if (window.location.pathname === '/auth') {
    // @TODO: error handling

    const { state, code } = deparamefy(window.location.href);
    // @TODO: verify `state` param matches what was saved before

    fetch(accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: paramefy({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('ACCESS_TOKEN', data.access_token);
        window.location.href = window.location.origin;
      });
  }

  const handleLogin = () => {
    const queryParams = {
      client_id: clientId,
      response_type: 'code',
      state: getRandomString(), // @TODO: store this in localStorage to verify later
      redirect_uri: redirectUri,
      duration: 'permanent',
      scope: 'read',
    };
    const redditAuthrl = `${authorizationUrl}?${paramefy(queryParams)}`;
    window.location.href = redditAuthrl;
  };

  const value = {
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
