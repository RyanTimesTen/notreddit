import * as React from 'react';

import {
  verificationCodeKey,
  clientId,
  redirectUri,
  desktopAuthorizationUrl,
  authorizationUrl,
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
  const { authorize } = useAccessToken();

  React.useEffect(() => {
    if (window.location.pathname === '/auth') {
      const { state, code } = deparamefy(window.location.href);
      const savedVerificationCode = localStorage.getItem(verificationCodeKey);
      if (state !== savedVerificationCode) {
        console.error(`Returned state value ${state} did not match ${savedVerificationCode}`);
        return;
      }

      authorize(code);
      window.location.href = window.location.origin;
    }
  }, [authorize]);

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
