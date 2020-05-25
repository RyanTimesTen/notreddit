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

  type SecureMedia {
    redditVideo: RedditVideo
  }

  type RedditVideo {
    fallbackUrl: String
  }

  type Post {
    author: String
    body: String
    comments(depth: Int, limit: Int): [Comment!]
    created: Float!
    gif: String
    id: ID!
    images: [Image!]
    numComments: Int!
    score: Int!
    secureMedia: SecureMedia
    subreddit: String!
    thumbnail: String!
    title: String!
    type: String
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
    comments: (post, args, { api }) => api.getComments(post.id, args),
    created: post => post.created_utc,
    gif: post => {
      if (!post.secure_media_embed) return null;
      return post.secure_media_embed.media_domain_url;
    },
    images: post => {
      if (!post.preview) return null;
      const images = post.preview.images[0];
      return [images.source, ...images.resolutions].map(i => ({
        ...i,
        url: (i.url || '').replace('amp;', ''), // remove encoding from reddit
      }));
    },
    numComments: post => post.num_comments,
    secureMedia: post => post.secure_media,
    type: post => post.post_hint,
  },
  Comment: {
    replies: (comment, args, { api }) => api.getReplies(comment, args),
  },
  SecureMedia: {
    redditVideo: media => media.reddit_video,
  },
  RedditVideo: {
    fallbackUrl: video => video.fallback_url,
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
