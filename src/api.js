const fetch = require('node-fetch');
const qs = require('qs');

class Api {
  constructor({ baseUrl } = {}) {
    this.baseUrl = baseUrl || 'https://oauth.reddit.com';
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

  async get(url, params) {
    const fetchOptions = this.getFetchOptions();

    try {
      const response = await fetch(
        params ? `${url}?${qs.stringify(params)}` : url,
        fetchOptions
      );

      if (response.status === 401) {
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      console.log(`Failed to fetch: ${error.message}`);
      throw error;
    }
  }

  async getPosts(type, params = null) {
    try {
      const response = await this.get(`${this.baseUrl}/${type}`, params);
      return response.data.children.map(post => post.data);
    } catch (error) {
      console.log(`Failed to fetch posts: ${error.message}`);
      throw error;
    }
  }

  async getComments(post, params = null) {
    try {
      const response = await this.get(
        `${this.baseUrl}/comments/${post}`,
        params
      );
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
      const response = await this.get(
        `${this.baseUrl}/user/${username}/about`,
        null
      );
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch user ${username}: ${error.message}`);
      throw error;
    }
  }
}

const createApi = () => new Api();

module.exports = { createApi };
