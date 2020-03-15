import React from 'react';
import styled from 'styled-components';
import { Posts } from './Posts';

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

export const App: React.FC = () => {
  return (
    <>
      <AppHeader></AppHeader>
      <Layout>
        <Posts />
      </Layout>
    </>
  );
};
