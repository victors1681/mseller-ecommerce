import React from 'react';
import {WebView, DataWeb} from '../webview';

export const AddCreditCard = (): React.ReactElement => {
  const handleCallBack = (payload: DataWeb) => {
    console.log('data', payload);
  };

  return (
    <React.Fragment>
      <WebView
        uri={'http://192.168.1.210:8088/cardnet/'}
        callback={handleCallBack}
        title="Agregar Tarjeta de crédito"
      />
    </React.Fragment>
  );
};
