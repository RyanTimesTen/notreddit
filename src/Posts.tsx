import React from 'react';
import styled from 'styled-components';
import { Post, IPost } from './Post';
import { useQuery } from 'urql';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    margin-top: 1rem;
  }

  & > :first-child {
    margin-top: 0;
  }
`;

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
    <Layout>
      {fetching ? (
        <div>fetching...</div>
      ) : error ? (
        <div>oops</div>
      ) : (
        data && data.posts.map(post => <Post key={post.id} post={post}></Post>)
      )}
    </Layout>
  );
};
