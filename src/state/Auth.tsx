import * as React from 'react';

interface IAuthContext {
  handleLogin(): void;
}

export const AuthContext = React.createContext<IAuthContext>({
  handleLogin: () => {},
});

const authorizationUrl = 'https://www.reddit.com/api/v1/authorize.compact';
const desktopAuthorizationUrl = 'https://www.reddit.com/api/v1/authorize';
const accessTokenUrl = 'https://www.reddit.com/api/v1/access_token';

const clientId = process.env.REACT_APP_CLIENT_ID || '';
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || '';
const redirectUri = process.env.REACT_APP_REDIRECT_URI || '';

const verificationCodeKey = 'VERIFICATION_CODE';
export const accessTokenKey = 'ACCESS_TOKEN';

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

const accessTokenFetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  },
};

export const AuthProvider: React.FC = ({ children }) => {
  const refreshIntervalId = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (window.location.pathname === '/auth') {
      const { state, code } = deparamefy(window.location.href);
      const savedVerificationCode = localStorage.getItem(verificationCodeKey);
      if (state !== savedVerificationCode) {
        console.error(`Returned state value ${state} did not match ${savedVerificationCode}`);
        return;
      }

      fetch(accessTokenUrl, {
        ...accessTokenFetchOptions,
        body: paramefy({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      })
        .then((response) => response.json())
        .then(({ access_token, expires_in, refresh_token }) => {
          localStorage.setItem(accessTokenKey, access_token);
          refreshIntervalId.current = setInterval(() => {
            refreshAccessToken(refresh_token);
          }, expires_in * 1000);
          window.location.href = window.location.origin;
        });
    }
  });

  React.useEffect(() => {
    return () => {
      if (refreshIntervalId.current) {
        clearInterval(refreshIntervalId.current);
      }
    };
  });

  const refreshAccessToken = (refreshToken: string) => {
    fetch(accessTokenUrl, {
      ...accessTokenFetchOptions,
      body: paramefy({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })
      .then((response) => response.json())
      .then(({ access_token }) => {
        localStorage.setItem(accessTokenKey, access_token);
      });
  };

  const handleLogin = () => {
    const verificationCode = getRandomString();
    localStorage.setItem(verificationCodeKey, verificationCode);
    const queryParams = {
      client_id: clientId,
      response_type: 'code',
      state: verificationCode,
      redirect_uri: redirectUri,
      duration: 'permanent',
      scope: 'read',
    };

    const isDesktop = window.matchMedia('(min-width: 415px)').matches;
    const url = isDesktop ? desktopAuthorizationUrl : authorizationUrl;
    const redditAuthUrl = `${url}?${paramefy(queryParams)}`;
    window.location.href = redditAuthUrl;
  };

  const value = {
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
