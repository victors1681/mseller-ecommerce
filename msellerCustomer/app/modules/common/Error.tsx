import {ApolloError} from '@apollo/client';
import React from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';

interface Props {
  error: ApolloError | undefined;
}
export const Error: React.FC<Props> = ({error}) => {
  console.error(JSON.stringify(error));
  return <View style={styles.wrapper}>{Alert.alert(error?.message)}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Error;
