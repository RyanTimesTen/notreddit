import * as React from 'react';
import { useMutation } from 'urql';

interface IAuthContext {
  handleLogin(): void;
}

export const AuthContext = React.createContext<IAuthContext>({
  handleLogin: () => {},
});

const authorizationUrl = 'https://www.reddit.com/api/v1/authorize.compact';
const desktopAuthorizationUrl = 'https://www.reddit.com/api/v1/authorize';

const clientId = process.env.REACT_APP_CLIENT_ID || '';
const redirectUri = process.env.REACT_APP_REDIRECT_URI || '';

const verificationCodeKey = 'VERIFICATION_CODE';
export const accessTokenKey = 'ACCESS_TOKEN';
export const refreshTokenKey = 'REFRESH_TOKEN';
export const expiresDateKey = 'EXPIRES_DATE';

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

const authorizationMutation = `
  mutation Authorize($authCode: String!) {
    authorize(authCode: $authCode) {
      accessToken
      expiresIn
      refreshToken
    }
  }
`;

const refreshAccessTokenMutation = `
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      accessToken
      expiresIn
    }
  }
`;

interface IAuthorizationPayload {
  authorize: {
    accessToken?: string;
    expiresIn?: number;
    refreshToken?: string;
  };
}

interface IAuthorizationArgs {
  authCode: string;
}

interface IRefreshAccessTokenArgs {
  refreshToken: string;
}

export const AuthProvider: React.FC = ({ children }) => {
  const tokenRefreshId = React.useRef<number | null>(null);

  const [, authorize] = useMutation<IAuthorizationPayload, IAuthorizationArgs>(
    authorizationMutation
  );

  const [, refreshAccessToken] = useMutation<IAuthorizationPayload, IRefreshAccessTokenArgs>(
    refreshAccessTokenMutation
  );

  const handleRefreshAccessToken = React.useCallback(() => {
    const refreshToken = localStorage.getItem(refreshTokenKey);
    if (!refreshToken) {
      return;
    }

    refreshAccessToken({ refreshToken }).then(({ data }) => {
      localStorage.setItem(accessTokenKey, data?.authorize.accessToken ?? '');
    });
  }, [refreshAccessToken]);

  // Schedule token refresh
  React.useEffect(() => {
    const expirationDate = localStorage.getItem(expiresDateKey);
    if (!expirationDate) {
      return;
    }
    const millisUntilExpiration = Number(expirationDate) - Date.now();
    tokenRefreshId.current = setInterval(handleRefreshAccessToken, millisUntilExpiration);
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (window.location.pathname === '/auth') {
      const { state, code } = deparamefy(window.location.href);
      const savedVerificationCode = localStorage.getItem(verificationCodeKey);
      if (state !== savedVerificationCode) {
        console.error(`Returned state value ${state} did not match ${savedVerificationCode}`);
        return;
      }

      authorize({ authCode: code }).then(({ data, error }) => {
        if (!data || !data.authorize) {
          console.error('Authorization failed.', { error });
          return;
        }

        const { accessToken, expiresIn, refreshToken } = data.authorize;
        localStorage.setItem(accessTokenKey, accessToken ?? '');
        localStorage.setItem(refreshTokenKey, refreshToken ?? '');

        if (expiresIn) {
          const millisUntilExpiration = (Date.now() + expiresIn * 1000).toString();
          localStorage.setItem(expiresDateKey, millisUntilExpiration);
          tokenRefreshId.current = setInterval(handleRefreshAccessToken, millisUntilExpiration);
        }
      });
    }
  }, [authorize, handleRefreshAccessToken]);

  React.useEffect(() => {
    return () => {
      if (tokenRefreshId.current) {
        clearInterval(tokenRefreshId.current);
      }
    };
  });

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

  const value = { handleLogin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
