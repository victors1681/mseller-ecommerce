import React from 'react';
import {Button, StyleService, Text, useStyleSheet} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/core';

import {
  WebView as WebViewComponent,
  WebViewMessageEvent,
} from 'react-native-webview';

interface DataWeb {
  token?: string;
  error?: string;
}
export const WebView = (): React.ReactElement => {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('WEBVIEW');
  });

  const handleIncomingMessages = (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data) as DataWeb;

      console.log('MS', payload.token);

      console.log('ERROR', payload.error);

      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <WebViewComponent
      sharedCookiesEnabled
      onMessage={handleIncomingMessages}
      source={{uri: 'http://192.168.1.210:8088/cardnet/'}}
      style={{marginTop: 20}}
    />
  );
};

const themedStyles = StyleService.create({
  termsCheckBoxText: {
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
    marginLeft: 10,
  },
});
