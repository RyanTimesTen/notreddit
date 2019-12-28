const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    created: Float!
    commentKarma: Int!
    linkKarma: Int!
  }

  type Comment {
    id: ID!
    author: String
    body: String
    replies: [Comment!]
  }

  type Image {
    url: String!
    width: Int!
    height: Int!
  }

  type Post {
    id: ID!
    author: String
    body: String
    type: String
    score: Int!
    created: Float!
    comments(depth: Int, limit: Int): [Comment!]
    numComments: Int!
    images: [Image!]
    gif: String
    subreddit: String!
    thumbnail: String!
    title: String!
    url: String
  }

  enum Listing {
    best
    hot
    new
    random
    rising
    top
  }

  type Query {
    user(username: String!): User!
    posts(listing: Listing!, after: String, before: String, limit: Int): [Post!]
  }
`;

const resolvers = {
  Query: {
    user: (_, { username }, { api }) => api.getUser(username),
    posts: (_, { listing, ...params }, { api }) =>
      api.getPosts(listing, params),
  },
  Post: {
    body: post => post.selftext,
    type: post => post.post_hint,
    created: post => post.created_utc,
    comments: (post, args, { api }) => api.getComments(post.id, args),
    numComments: post => post.num_comments,
    images(post) {
      if (!post.preview) return null;
      const images = post.preview.images[0];
      return [images.source, ...images.resolutions].map(i => ({
        ...i,
        url: (i.url || '').replace('amp;', ''), // remove encoding from reddit
      }));
    },
    gif(post) {
      if (!post.secure_media_embed) return null;
      return post.secure_media_embed.media_domain_url;
    },
  },
  Comment: {
    replies: (comment, args, { api }) => api.getReplies(comment, args),
  },
  User: {
    username: user => user.name,
    commentKarma: user => user.comment_karma,
    linkKarma: user => user.link_karma,
    created: user => user.created_utc,
  },
};

module.exports = { typeDefs, resolvers };
