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
import { useQuery } from 'urql';

interface IUser {
  id: string;
  username: string;
}

interface IAuthContext {
  handleLogin(): void;
  handleLogout(): void;
  user: IUser | null;
}

export const AuthContext = React.createContext<IAuthContext>({
  handleLogin: () => {},
  handleLogout: () => {},
  user: null,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const { authorize } = useAccessToken();
  const [getMeResult] = useQuery<{ me: IUser }>({
    query: `
      {
        me {
          id
          username
        }
      }
      `,
  });

  React.useEffect(() => {
    if (getMeResult.data) {
      setUser(getMeResult.data.me);
    }
  }, [getMeResult]);

  React.useEffect(() => {
    if (window.location.pathname === '/auth') {
      const { state, code } = deparamefy(window.location.href);
      const savedVerificationCode = localStorage.getItem(verificationCodeKey);
      if (state !== savedVerificationCode) {
        console.error(`Returned state value ${state} did not match ${savedVerificationCode}`);
        return;
      }

      authorize(code).then(() => {
        window.location.href = window.location.origin;
      });
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
      scope: 'identity,read',
    };

    const isDesktop = window.matchMedia('(min-width: 415px)').matches;
    const url = isDesktop ? desktopAuthorizationUrl : authorizationUrl;
    const redditAuthUrl = `${url}?${paramefy(queryParams)}`;
    window.location.href = redditAuthUrl;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const value = { handleLogin, handleLogout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
