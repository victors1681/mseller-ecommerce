import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';

export const LoadingIndicator: React.FC = (props: any) => {
  return (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" />
    </View>
  );
};

export const LoadingIndicatorWhite: React.FC = (props: any) => {
  return (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" status="control" />
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
