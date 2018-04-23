const typeDefs = `
  type User {
    id: ID!
    username: String!
    created: Float!
    commentKarma: Int!
    linkKarma: Int!
  }

  type Comment {
    id: ID!
    author: String!
    body: String!
    replies: [Comment!]
  }

  type Image {
    url: String!
    width: Int!
    height: Int!
  }

  type Post {
    id: ID!
    author: String!
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

  type Query {
    user(username: String!): User!
    posts(type: String!, after: String, before: String, limit: Int): [Post!]
  }

  type Schema {
    query: Query
  }
`;

export default typeDefs;
