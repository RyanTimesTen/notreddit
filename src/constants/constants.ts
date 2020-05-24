export const verificationCodeKey = 'VERIFICATION_CODE';
export const accessTokenKey = 'ACCESS_TOKEN';
export const refreshTokenKey = 'REFRESH_TOKEN';
export const expirationDateMillisKey = 'EXPIRATION_DATE_MILLIS';

export const authorizationUrl = 'https://www.reddit.com/api/v1/authorize.compact';
export const desktopAuthorizationUrl = 'https://www.reddit.com/api/v1/authorize';

export const clientId = process.env.REACT_APP_CLIENT_ID || '';
export const redirectUri = process.env.REACT_APP_REDIRECT_URI || '';

export const graphqlUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:9000/.netlify/functions/graphql'
    : 'https://notreddit.app/.netlify/functions/graphql';
