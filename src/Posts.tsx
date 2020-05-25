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
          author
          body
          id
          preview {
            images {
              source {
                url
              }
              variants {
                mp4 {
                  source {
                    url
                  }
                }
              }
            }
            redditVideoPreview {
              fallbackUrl
            }
          }
          secureMedia {
            redditVideo {
              fallbackUrl
            }
          }
          subreddit
          title
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
