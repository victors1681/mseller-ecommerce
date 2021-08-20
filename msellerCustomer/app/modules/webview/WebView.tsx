import React from 'react';
import {Layout, TopNavigation} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/core';
import {BackButtonAction} from 'app/modules/common';
import {
  WebView as WebViewComponent,
  WebViewMessageEvent,
} from 'react-native-webview';
import {StyleSheet} from 'react-native';
import {SafeAreaLayout} from 'app/modules/common';

export interface DataWeb {
  token?: string;
  error?: string;
}

interface Props {
  uri: string;
  title?: string;
  callback?: (payload: DataWeb) => void;
}

export const WebView = ({uri, callback, title}: Props): React.ReactElement => {
  const navigation = useNavigation();

  const handleIncomingMessages = (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data) as DataWeb;

      //Send the response form the webView
      callback && callback(payload);
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  //'http://192.168.1.210:8088/cardnet/'
  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <Layout style={styles.container} level="1">
        <TopNavigation
          alignment="center"
          title={title}
          accessoryLeft={BackButtonAction}
        />
        <WebViewComponent
          sharedCookiesEnabled
          onMessage={handleIncomingMessages}
          source={{uri}}
        />
      </Layout>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
