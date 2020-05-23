import fetch from 'node-fetch';
import qs from 'qs';
import { paramefy } from './util';

const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';
const redirectUri = process.env.REDIRECT_URI || '';

const accessTokenUrl = 'https://www.reddit.com/api/v1/access_token';

const accessTokenFetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
  },
};

export class Api {
  constructor({ baseUrl = 'https://oauth.reddit.com' } = {}) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setAuth(token) {
    this.token = token;
  }

  getFetchOptions() {
    return {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    };
  }

  async get(endpoint, params = {}) {
    const fetchOptions = this.getFetchOptions();
    let url = this.baseUrl + endpoint;

    if (Object.keys(params).length > 0) {
      url += '?' + qs.stringify(params);
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      console.log(`Failed to fetch: ${error.message}`);
      throw error;
    }
  }

  async getMe() {
    try {
      return await this.get('/api/v1/me');
    } catch (error) {
      console.error(`Failed to fetch me: ${error.message}`);
      throw error;
    }
  }

  async getPosts(listing, params = {}) {
    try {
      const response = await this.get(`/${listing}`, params);
      return response.data.children.map(post => post.data);
    } catch (error) {
      console.log(`Failed to fetch posts: ${error.message}`);
      throw error;
    }
  }

  async getComments(postId, params = {}) {
    try {
      const response = await this.get(`/comments/${postId}`, params);
      return response[1].data.children.map(comment => comment.data);
    } catch (error) {
      console.log(`Failed to fetch comments: ${error.message}`);
      throw error;
    }
  }

  getReplies(comment) {
    try {
      if (!comment.replies) return null;

      return comment.replies.data.children.map(reply => reply.data);
    } catch (error) {
      console.log(`Failed to map replies from comment ${comment.id}: ${error.message}`);
      throw error;
    }
  }

  async getUser(username) {
    try {
      const response = await this.get(`/user/${username}/about`);
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch user ${username}: ${error.message}`);
      throw error;
    }
  }

  async fetchAccessToken(authCode) {
    let payload = {};

    try {
      const response = await (
        await fetch(accessTokenUrl, {
          ...accessTokenFetchOptions,
          body: paramefy({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
          }),
        })
      ).json();

      if (response.error) {
        throw new Error(response.message || response.error);
      }

      payload = {
        accessToken: response.access_token,
        expiresIn: response.expires_in,
        refreshToken: response.refresh_token,
      };
    } catch (err) {
      console.error({ err }, 'Error fetching access token');
      throw err;
    }

    return payload;
  }

  async refreshAccessToken(refreshToken) {
    let payload = {};

    try {
      const response = await (
        await fetch(accessTokenUrl, {
          ...accessTokenFetchOptions,
          body: paramefy({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        })
      ).json();

      if (response.error) {
        throw new Error(response.message || response.error);
      }

      payload = { accessToken: response.access_token, expiresIn: response.expires_in };
    } catch (err) {
      console.error({ err }, 'Error refreshing access token');
      throw err;
    }

    return payload;
  }
}

export const createApi = () => new Api();
