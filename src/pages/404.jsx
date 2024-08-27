import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

/**
* 404 Page
*
* Este componente representa la página NotFound.
*
* @returns {JSX.Element} 
*/
const NotFoundPage = () => (
  <Page>
    <Navbar title="Not found"/>
    <Block strong inset>
      <p>Sorry</p>
      <p>Requested content not found.</p>
    </Block>
  </Page>
);

export default NotFoundPage;
