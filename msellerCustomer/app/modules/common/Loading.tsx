import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Loading: React.FC<{fullScreen?: boolean}> = ({fullScreen}) => {
  return (
    <View style={fullScreen ? styles.fullScreen : styles.wrapper}>
      <Spinner />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(83, 83, 83, 0.5)',
  },
});

export default Loading;
