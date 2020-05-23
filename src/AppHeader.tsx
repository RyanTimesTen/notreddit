import React from 'react';
import styled from 'styled-components';
import { useAuth } from './state';

const Header = styled.header`
  width: 100%;
  height: 80px;
  border-bottom: 1.5px solid #000;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 300px;
  @media (min-width: 425px) {
    max-width: 525px;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthButton = styled.button`
  color: inherit;
  cursor: pointer;
  background-color: inherit;
  border: none;
  font-size: 1rem;
  height: 100%;
  :hover {
    text-decoration: underline;
  }
`;

const Title = styled.span`
  font-size: 1.25rem;
`;

const Hidden = styled.div`
  visibility: hidden;
`;

export const AppHeader: React.FC = () => {
  const { handleLogin, handleLogout, user } = useAuth();

  return (
    <Header>
      <Content>
        {user ? (
          <>
            <span>{user.username}</span>
            <Title>NotReddit</Title>
            <AuthButton onClick={handleLogout}>Log Out</AuthButton>
          </>
        ) : (
          <>
            <Hidden>hidden</Hidden>
            <Title>NotReddit</Title>
            <AuthButton onClick={handleLogin}>Log In</AuthButton>
          </>
        )}
      </Content>
    </Header>
  );
};
