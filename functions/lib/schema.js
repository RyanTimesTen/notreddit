import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
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

  type AuthorizationPayload {
    accessToken: String
    expiresIn: Int
    refreshToken: String
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
    me: User!
    posts(listing: Listing!, after: String, before: String, limit: Int): [Post!]
    user(username: String!): User!
  }

  type Mutation {
    authorize(authCode: String!): AuthorizationPayload
    refreshAccessToken(refreshToken: String!): AuthorizationPayload
  }
`;

export const resolvers = {
  Query: {
    me: (_, __, { api }) => api.getMe(),
    posts: (_, { listing, ...params }, { api }) => api.getPosts(listing, params),
    user: (_, { username }, { api }) => api.getUser(username),
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
  Mutation: {
    authorize: (_, { authCode }, { api }) => api.fetchAccessToken(authCode),
    refreshAccessToken: (_, { refreshToken }, { api }) => api.refreshAccessToken(refreshToken),
  },
};
