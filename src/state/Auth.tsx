import * as React from 'react';

import {
  verificationCodeKey,
  clientId,
  redirectUri,
  desktopAuthorizationUrl,
  authorizationUrl,
  refreshTokenKey,
  accessTokenKey,
  millisUntilExpirationKey,
} from '../constants';
import { deparamefy, getRandomString, paramefy } from '../utils';
import { useAccessToken } from '../hooks';

interface IAuthContext {
  handleLogin(): void;
}

export const AuthContext = React.createContext<IAuthContext>({
  handleLogin: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const tokenRefreshId = React.useRef<number | null>(null);

  const { authorize, refreshAccessToken } = useAccessToken();

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
    const expirationDate = localStorage.getItem(millisUntilExpirationKey);
    if (!expirationDate) {
      return;
    }
    const millisUntilExpiration = Number(expirationDate) - Date.now();
    if (Date.now() > millisUntilExpiration) {
      handleRefreshAccessToken();
    } else {
      tokenRefreshId.current = setInterval(handleRefreshAccessToken, millisUntilExpiration);
    }
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
          localStorage.setItem(millisUntilExpirationKey, millisUntilExpiration);
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
