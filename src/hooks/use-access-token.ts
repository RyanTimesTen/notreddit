import React from 'react';
import { useMutation } from 'urql';

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

export const useAccessToken = () => {
  const [, authorize] = useMutation<IAuthorizationPayload, IAuthorizationArgs>(
    authorizationMutation
  );

  const [, refreshAccessToken] = useMutation<IAuthorizationPayload, IRefreshAccessTokenArgs>(
    refreshAccessTokenMutation
  );

  const value = React.useMemo(() => ({ authorize, refreshAccessToken }), [
    authorize,
    refreshAccessToken,
  ]);

  return value;
};
