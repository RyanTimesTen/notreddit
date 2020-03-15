import React from 'react';
import styled from 'styled-components';

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

const Card = styled.div`
  max-width: 300px;

  @media (min-width: 425px) {
    max-width: 525px;
  }

  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #000;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
`;

export interface IPost {
  id: string;
  title: string;
  author: string;
}

interface PostProps {
  post: IPost;
}

export const Post: React.FC<PostProps> = ({ post }) => (
  <Card>
    <PostHeader>
      <HeaderDetails>
        <Title>{post.title}</Title>
        <Username>{post.author}</Username>
      </HeaderDetails>
    </PostHeader>
    <Body>
      {/* {post.images && (
                    <img
                      src={
                        post.images.find((img: any) => img.width === 640).url
                      }
                      alt={post.images[0].alt || ''}
                    />
                  )} */}
    </Body>
  </Card>
);
