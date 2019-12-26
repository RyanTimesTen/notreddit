const fetch = require('node-fetch');
const qs = require('qs');

class Api {
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

  async getPosts(listing, params = {}) {
    try {
      const response = await this.get(`/${listing}`, params);
      return response.data.children.map(post => post.data);
    } catch (error) {
      console.log(`Failed to fetch posts: ${error.message}`);
      throw error;
    }
  }

  async getComments(post, params = {}) {
    try {
      const response = await this.get(`/comments/${post}`, params);
      return response[1].data.children
        .slice(0, -1)
        .map(comment => comment.data);
    } catch (error) {
      console.log(`Failed to fetch comments: ${error.message}`);
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
}

const createApi = () => new Api();

module.exports = { createApi };
