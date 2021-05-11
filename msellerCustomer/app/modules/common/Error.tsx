import {ApolloError} from '@apollo/client';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface Props {
  error: ApolloError | undefined;
}
export const Error: React.FC<Props> = ({error}) => {
  return (
    <View style={styles.wrapper}>
      <Text>An error occurred {JSON.stringify(error)}</Text>
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

export default Error;
