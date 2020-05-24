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
  padding: 1rem;

  @media (min-width: 425px) {
    max-width: 525px;
  }
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
  float: right;
  padding: 0;
`;

export const AppHeader: React.FC = () => {
  const { handleLogin, handleLogout, user } = useAuth();

  return (
    <Header>
      <Content>
        {user ? (
          <>
            <span>{user.username}</span>
            <AuthButton onClick={handleLogout}>log out</AuthButton>
          </>
        ) : (
          <>
            <AuthButton onClick={handleLogin}>log in</AuthButton>
          </>
        )}
      </Content>
    </Header>
  );
};
