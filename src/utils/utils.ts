import { accessTokenKey, expirationDateMillisKey, refreshTokenKey } from '../constants';

// https://gist.github.com/6174/6062387
export const getRandomString = () =>
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

export const isTokenExpired = () => {
  const expirationDate = getExpirationDate();
  if (!expirationDate) {
    return false;
  }

  return Date.now() > Number(expirationDate);
};

export const getToken = () => localStorage.getItem(accessTokenKey);
export const setToken = (token: string) => localStorage.setItem(accessTokenKey, token);

export const getRefreshToken = () => localStorage.getItem(refreshTokenKey);
export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(refreshTokenKey, refreshToken);
};

export const getExpirationDate = () => localStorage.getItem(expirationDateMillisKey);
export const setExpirationDate = (expiresInSeconds: number) => {
  const expirationDate = (Date.now() + expiresInSeconds * 1000).toString();
  localStorage.setItem(expirationDateMillisKey, expirationDate);
};
