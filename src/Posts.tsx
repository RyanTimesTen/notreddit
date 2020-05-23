import React from 'react';
import { useQuery } from 'urql';

import { Post, IPost } from './Post';

interface IPosts {
  posts: IPost[];
}

export const Posts: React.FC = () => {
  const [{ fetching, data, error }] = useQuery<IPosts>({
    query: `
      {
        posts(listing: best) {
          id
          author
          title
          images {
            url
            width
          }
      }
    }
    `,
  });

  return (
    <>
      {fetching ? (
        <div>fetching...</div>
      ) : error ? (
        <div>oops</div>
      ) : (
        data && data.posts.map(post => <Post key={post.id} post={post}></Post>)
      )}
    </>
  );
};
