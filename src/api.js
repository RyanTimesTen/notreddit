import fetch from 'node-fetch';
import qs from 'qs';

const REDDIT_API_URL = 'https://oauth.reddit.com';

/**
 * Generic function to hit a Reddit API endpoint with options and auth
 *
 * @param {string} endpoint The Reddit API endpoint to hit
 * @param {object} params The options to pass to the Reddit API endpoint
 * @param {string} token Reddit OAuth token
 */
const get = (url, params, token) =>
  fetch(params ? `${url}?${qs.stringify(params)}` : url, {
    method: 'GET',
    headers: {
      Authorization: `bearer ${token}`,
    },
  }).then(res => res.json());

export const getPosts = (type, token, params = null) =>
  get(`${REDDIT_API_URL}/${type}`, params, token)
    .then(res => res.data.children.map(post => post.data))
    .catch(err => console.log(err)); // TODO: Do some real logging

export const getComments = (post, token, params = null) =>
  get(`${REDDIT_API_URL}/comments/${post}`, params, token).then(data =>
    data[1].data.children.slice(0, -1).map(comment => comment.data),
  );

export const getUser = (username, token) =>
  get(`${REDDIT_API_URL}/user/${username}/about`, null, token).then(
    res => res.data,
  );
