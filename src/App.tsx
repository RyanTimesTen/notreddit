import React from 'react';
import styled from 'styled-components';

import { Posts } from './Posts';
import { AppHeader } from './AppHeader';
import { useAuth } from './state';

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

const Text = styled.div<{ centered?: boolean }>`
  text-align: ${p => (p.centered ? 'center' : 'left')};
`;

export const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <AppHeader />
      <Layout>
        {user ? (
          <>
            <Text>r/best</Text>
            <Posts />
          </>
        ) : (
          <Text centered>
            log in to see posts
            <br />
            you will be taken to reddit.com to log in there
          </Text>
        )}
      </Layout>
    </>
  );
};
