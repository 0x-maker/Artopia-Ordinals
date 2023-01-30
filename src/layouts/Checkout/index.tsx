import React, { ReactNode } from 'react';

import Header from './Header';

interface IProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<IProps> = ({ children }): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;
