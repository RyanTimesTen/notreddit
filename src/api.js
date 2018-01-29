import fetch from 'node-fetch';
import qs from 'qs';

const REDDIT_API_URL = 'https://oauth.reddit.com';

const get = (url, params, token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `bearer ${token}`,
    },
  };

  return fetch(params ? `${url}?${qs.stringify(params)}` : url, options)
    .then(res => res.json());
};

export const getPosts = (type, token, params = {}) => {
  const url = `${REDDIT_API_URL}/${type}`;
  return get(url, params, token);
};

export const getComments = (post, token, params = {}) => {
  const url = `${REDDIT_API_URL}/comments/${post}`;
  return get(url, params, token);
};

export const getUser = (username, token) => {
  const url = `${REDDIT_API_URL}/user/${username}/about`;
  return get(url, null, token);
};
