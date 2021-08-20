import React from 'react';
import {WebView} from '../webview';

export const AboutUs = (): React.ReactElement => {
  return (
    <React.Fragment>
      <WebView uri={'https://mobile-seller.com'} title="Mobile Seller" />
    </React.Fragment>
  );
};
