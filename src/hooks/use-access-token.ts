import React from 'react';
import { useMutation } from 'urql';
import {
  isTokenExpired,
  getRefreshToken,
  setToken,
  setExpirationDate,
  setRefreshToken,
} from '../utils';

const authorizationMutationDocument = `
  mutation Authorize($authCode: String!) {
    authorize(authCode: $authCode) {
      accessToken
      expiresIn
      refreshToken
    }
  }
`;

const refreshAccessTokenMutationDocument = `
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

interface IRefreshTokenPayload {
  refreshAccessToken: {
    accessToken?: string;
    expiresIn?: number;
  };
}

interface IAuthorizationArgs {
  authCode: string;
}

interface IRefreshAccessTokenArgs {
  refreshToken: string;
}

export const useAccessToken = () => {
  const authorizeMutation = useMutation<IAuthorizationPayload, IAuthorizationArgs>(
    authorizationMutationDocument
  )[1];

  const refreshAccessTokenMutation = useMutation<IRefreshTokenPayload, IRefreshAccessTokenArgs>(
    refreshAccessTokenMutationDocument
  )[1];

  const authorize = React.useCallback(
    async (code: string) => {
      const { data, error } = await authorizeMutation({ authCode: code });
      if (!data || error) {
        console.error('Authorization failed.', { error });
        return;
      }

      const { accessToken, expiresIn, refreshToken } = data.authorize;

      if (!accessToken) {
        console.error('No access token returned from authorization');
        return;
      }

      setToken(accessToken);

      if (!expiresIn) {
        console.error('No expiration date returned from authorization');
      } else {
        setExpirationDate(expiresIn);
      }

      if (!refreshToken) {
        console.error('No refresh token returned from authorization');
        return;
      }

      setRefreshToken(refreshToken);
    },
    [authorizeMutation]
  );

  const refreshAccessToken = React.useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available');
      return;
    }

    const { data, error } = await refreshAccessTokenMutation({ refreshToken });
    if (!data || error) {
      console.error('Token refresh failed', { error });
      return;
    }

    const { expiresIn, accessToken } = data.refreshAccessToken;

    if (!accessToken) {
      console.error('No access token returned from refresh');
      return;
    }

    setToken(accessToken);

    if (!expiresIn) {
      console.error('No expiration date returned from refresh');
      return;
    }

    setExpirationDate(expiresIn);
  }, [refreshAccessTokenMutation]);

  // Check if we need to refresh the token
  React.useEffect(() => {
    if (isTokenExpired()) {
      refreshAccessToken();
    }
  }, [refreshAccessToken]);

  const value = React.useMemo(() => ({ authorize }), [authorize]);

  return value;
};
