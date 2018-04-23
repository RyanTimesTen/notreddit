import { getComments, getPosts, getUser } from '../api';

export default {
  Query: {
    user: (_, { username }, { token }) => getUser(username, token),
    posts: (_, { type, ...params }, { token }) => getPosts(type, token, params),
  },
  Post: {
    body: post => post.selftext,
    type: post => post.post_hint,
    created: post => post.created_utc,
    comments: (post, args, { token }) => getComments(post.id, token, args),
    numComments: post => post.num_comments,
    images(post) {
      if (!post.preview) return null;
      const images = post.preview.images[0];
      return [images.source, ...images.resolutions];
    },
    gif(post) {
      if (!post.secure_media_embed) return null;
      return post.secure_media_embed.media_domain_url;
    },
  },
  Comment: {
    replies: () => null, // TODO: Implement
  },
  User: {
    username: user => user.name,
    commentKarma: user => user.comment_karma,
    linkKarma: user => user.link_karma,
    created: user => user.created_utc,
  },
};
