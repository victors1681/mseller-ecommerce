import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider} from '@ui-kitten/components';
import Categories from '../modules/categories/Categories';
import {AutoComplete} from 'app/modules/product/components/autoComplete';
export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.autoComplete}>
        <AutoComplete />
      </View>
      <Divider />
      <Categories />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},

  autoComplete: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default HomeScreen;
