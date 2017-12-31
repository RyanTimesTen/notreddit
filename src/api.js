import fetch from 'node-fetch'
import qs from 'qs'

const REDDIT_API_URL = 'https://oauth.reddit.com'
const REDDIT_URL = 'https://reddit.com'

let get = (url, params, token) => {
  if (params) {
    url = url + `?${qs.stringify(params)}`
  }

  const options = {
    method: 'GET'
  }

  if (token) {
    options.headers = {
      'Authorization': `bearer ${token}`
    }
  }
  
  return fetch(url, options).then(res => res.json())
}

export const getPosts = (type, token, params = {}) => {
  const url = `${REDDIT_API_URL}/${type}`
  return get(url, params, token)
}

export const getComments = (post, token, params = {}) => {
  const url = `${REDDIT_API_URL}/comments/${post}`
  return get(url, params, token)
}

export const getUser = (username, token) => {
  const url = `${REDDIT_API_URL}/user/${username}/about`
  return get(url, null, token)
}