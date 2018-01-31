import { expect } from 'chai';
import nock from 'nock';

import { getComments, getPosts, getUser } from '../../src/api';

import commentsLimitResponse from '../recordings/comments_limit_7.json';
import commentsResponse from '../recordings/comments_small.json';
import hotPostsLimitResponse from '../recordings/hot_posts_limit_5.json';
import hotPostsResponse from '../recordings/hot_posts_large.json';
import userResponse from '../recordings/user.json';

const fakeToken = 'THIS_IS_A_FAKE_TOKEN';

describe('Querying post data without parameters', () => {
  const type = 'hot';

  beforeEach(() =>
    nock('https://oauth.reddit.com')
      .get(`/${type}`)
      .reply(200, hotPostsResponse));

  it('should receive an object encapsulating post data for a given type', () =>
    getPosts(type, fakeToken)
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.children[0].kind).to.equal('t3'); // t3 maps to Reddit post
      }));
});

describe('Querying post data with parameters', () => {
  const type = 'hot';
  const numPosts = 5;
  const parameters = {
    limit: numPosts,
  };

  beforeEach(() =>
    nock('https://oauth.reddit.com')
      .get(`/${type}?limit=${numPosts}`)
      .reply(200, hotPostsLimitResponse));

  it(`should receive ${numPosts} posts when limit parameter of ${numPosts} is passed in`, () =>
    getPosts(type, fakeToken, parameters)
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.children.length).to.equal(numPosts);
      }));
});

describe('Querying comments on a post without parameters given a post id', () => {
  const postId = '7tv323';

  beforeEach(() =>
    nock('https://oauth.reddit.com')
      .get(`/comments/${postId}`)
      .reply(200, commentsResponse));

  it(`should receive comments for post with id ${postId}`, () =>
    getComments(postId, fakeToken)
      .then((res) => {
        expect(typeof res).to.equal('object');

        const post = res[0];
        expect(post.data.children[0].data.id).to.equal(postId);
        expect(res[1].data.children[0].kind).to.equal('t1'); // t1 maps to Reddit comment
      }));
});

describe('Querying comments on a post with parameters given a post id', () => {
  const postId = '7u3h0g';
  const numComments = 7;
  const parameters = {
    limit: numComments,
  };

  beforeEach(() =>
    nock('https://oauth.reddit.com')
      .get(`/comments/${postId}?limit=${numComments}`)
      .reply(200, commentsLimitResponse));

  it(`should receive comments for post with id ${postId}`, () =>
    getComments(postId, fakeToken, parameters)
      .then((res) => {
        expect(typeof res).to.equal('object');

        const post = res[0];
        expect(post.data.children[0].data.id).to.equal(postId);
        expect(res[1].data.children[0].kind).to.equal('t1'); // t1 maps to Reddit comment
      }));
});

describe('Querying user data', () => {
  const username = '__gilb__';

  beforeEach(() =>
    nock('https://oauth.reddit.com')
      .get(`/user/${username}/about`)
      .reply(200, userResponse));

  it('should receive an object encapsulating user data for a given username', () =>
    getUser(username, fakeToken)
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.name).to.equal(username);
      }));
});
