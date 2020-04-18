import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #000;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;
`;

const LogInButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  background-color: #ffd1dc;
  font-size: 1rem;
  cursor: pointer;
`;

export const AppHeader: React.FC = () => {
  return (
    <Header>
      <LogInButton>Log In</LogInButton>
    </Header>
  );
};
