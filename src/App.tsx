import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'urql';

const Post = styled.div`
  max-width: 700px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #000;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
`;

const PostHeader = styled.div`
  display: flex;
  margin: 1rem;
`;

const HeaderDetails = styled.div``;

const Title = styled.div`
  font-weight: 600;
`;

const Username = styled.div`
  font-style: italic;
`;

const Body = styled.div``;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > ${Post} {
    margin-top: 1rem;
  }

  & > :first-child {
    margin-top: 0;
  }
`;

const Layout = styled.div`
  margin-bottom: 1rem;
`;

const AppHeader = styled.header`
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #000;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;
`;

const AppTitle = styled.h1`
  margin: 0;
`;

export const App: React.FC = () => {
  const [{ fetching, data, error }] = useQuery({
    query: `
      {
        posts(listing: best) {
        id
        author
        title
      }
    }
    `,
  });

  console.log({ data });

  return (
    <>
      <AppHeader>
        <AppTitle>Snooql</AppTitle>
      </AppHeader>
      <Layout>
        {fetching ? (
          <div>fetching...</div>
        ) : error ? (
          <div>oops</div>
        ) : (
          <Posts>
            {data.posts.map((post: any) => (
              <Post key={post.id}>
                <PostHeader>
                  <HeaderDetails>
                    <Title>{post.title}</Title>
                    <Username>{post.author}</Username>
                  </HeaderDetails>
                </PostHeader>
                {/* <Body>
                  <img src={post.image.src} alt={post.image.alt} />
                </Body> */}
              </Post>
            ))}
          </Posts>
        )}
      </Layout>
    </>
  );
};
