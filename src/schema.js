import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  getComments,
  getPosts,
  getUser,
} from './api';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A Reddit user.',
  fields: () => ({
    commentKarma: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The user\'s comment karma.',
      resolve: user => user.data.comment_karma,
    },
    created: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The date the user was created (UTC).',
      resolve: user => user.data.created_utc,
    },
    createdISO: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The date the user was created (ISO8601).',
      resolve: user => new Date(user.data.created_utc * 1000).toISOString(),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The user id.',
      resolve: user => user.data.id,
    },
    linkKarma: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The user\'s link karma.',
      resolve: user => user.data.link_karma,
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The user\'s username.',
      resolve: user => user.data.name,
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment on a post.',
  fields: () => ({
    author: {
      type: GraphQLString,
      description: 'The comment author.',
      resolve: comment => comment.data.author,
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The comment body.',
      resolve: comment => comment.data.body,
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the post commented on.',
      resolve: comment => comment.data.id,
    },
    replies: {
      type: new GraphQLList(CommentType),
      description: 'The comment replies.',
      args: {
        depth: {
          type: GraphQLInt,
          description: 'Maximum depth of subtrees in the thread',
        },
        limit: {
          type: GraphQLInt,
          description: 'Maximum number of comments to return',
        },
      },
      resolve: (comment) => {
        if (!comment.data.replies || comment.data.replies === '') {
          return null;
        }
        const { children } = comment.data.replies.data;
        if (children.length > 0 &&
            children[children.length - 1].kind === 'more') {
          return children.slice(0, -1);
        }
        return children;
      },
    },
  }),
});

const ImageType = new GraphQLObjectType({
  name: 'Image',
  description: 'The different image resolutions on a post.',
  fields: () => ({
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The image url.',
      resolve: resolution => resolution.url,
    },
    width: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The image width.',
      resolve: resolution => resolution.width,
    },
    height: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The image height.',
      resolve: resolution => resolution.height,
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'A Reddit post.',
  fields: () => ({
    author: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The post author.',
      resolve: post => post.data.author,
    },
    body: {
      type: GraphQLString,
      description: 'The post body.',
      resolve: post => post.data.selftext,
    },
    created: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The time the post was created (UTC).',
      resolve: post => post.data.created_utc,
    },
    createdISO: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The time the post was created (ISO8601).',
      resolve: post => new Date(post.data.created_utc * 1000).toISOString(),
    },
    comments: {
      type: new GraphQLList(CommentType),
      description: 'The comments on the post.',
      args: {
        depth: {
          type: GraphQLInt,
          description: 'Maximum depth of subtrees in the thread.',
        },
        limit: {
          type: GraphQLInt,
          description: 'Maximum number of comments to return.',
        },
      },
      resolve: (post, args, { token }) => {
        const postId = post.data.id;
        return getComments(postId, token, args)
          .then(data => data[1].data.children.slice(0, -1));
      },
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The post id.',
      resolve: post => post.data.id,
    },
    images: {
      type: new GraphQLList(ImageType),
      description: 'The image resolutions (if post is an image).',
      resolve: (post) => {
        if (!post.data.preview) return null;
        const images = post.data.preview.images[0];
        return [images.source, ...images.resolutions];
      },
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The fullname of the post.',
      resolve: post => post.data.name,
    },
    numComments: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The number of comments on the post.',
      resolve: post => post.data.num_comments,
    },
    postHint: {
      type: GraphQLString,
      description: 'The type of post.',
      resolve: post => post.data.post_hint,
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The post score.',
      resolve: post => post.data.score,
    },
    gifUrl: {
      type: GraphQLString,
      description: 'The gif url (if a gif was posted).',
      resolve: (post) => {
        if (!post.data.secure_media_embed) return null;
        return post.data.secure_media_embed.media_domain_url;
      },
    },
    subreddit: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The subreddit the post is on.',
      resolve: post => post.data.subreddit,
    },
    thumbnail: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The post thumbnail.',
      resolve: post => post.data.thumbnail,
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The post title.',
      resolve: post => post.data.title,
    },
    url: {
      type: GraphQLString,
      description: 'The linked url in the post.',
      resolve: post => post.data.url,
    },
  }),
});

const RedditType = new GraphQLObjectType({
  name: 'Reddit',
  description: 'The Reddit API',
  fields: () => ({
    user: {
      type: UserType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Username of the user.',
        },
      },
      resolve: (root, { username }, { token }) => getUser(username, token),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      description: 'Reddit posts',
      args: {
        type: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The type of post (hot, new rising).',
        },
        after: {
          type: GraphQLString,
          description: 'The fullname of an item to search after.',
        },
        before: {
          type: GraphQLString,
          description: 'The fullname of an item to search before.',
        },
        limit: {
          type: GraphQLInt,
          description: 'The maximum number of posts to return.',
        },
      },
      resolve: (root, { type, ...params }, { token }) =>
        getPosts(type, token, params).then(data => data.data.children),
    },
  }),
});

export default new GraphQLSchema({
  query: RedditType,
});
