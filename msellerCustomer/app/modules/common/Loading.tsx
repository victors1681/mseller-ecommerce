import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Loading: React.FC = () => {
  return (
    <View style={styles.wrapper}>
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
});

export default Loading;
