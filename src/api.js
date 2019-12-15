const qs = require('qs');

const REDDIT_API_URL = 'https://oauth.reddit.com';

const createApi = fetch => ({
  get(url, params) {
    return fetch(params ? `${url}?${qs.stringify(params)}` : url, {
      method: 'GET',
    }).then(res => res.json());
  },

  getPosts(type, params = null) {
    return this.get(`${REDDIT_API_URL}/${type}`, params)
      .then(res => res.data.children.map(post => post.data))
      .catch(err => console.log(err));
  },

  getComments(post, params = null) {
    return this.get(`${REDDIT_API_URL}/comments/${post}`, params).then(data =>
      data[1].data.children.slice(0, -1).map(comment => comment.data)
    );
  },

  getUser(username) {
    return this.get(`${REDDIT_API_URL}/user/${username}/about`, null).then(
      res => res.data
    );
  },
});

module.exports = { createApi };
