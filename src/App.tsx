import React from 'react';

import { Posts } from './Posts';
import { AppHeader } from './AppHeader';

export const App: React.FC = () => {
  return (
    <>
      <AppHeader></AppHeader>
      <Posts />
    </>
  );
};
