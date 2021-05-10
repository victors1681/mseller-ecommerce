import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text} from '@ui-kitten/components';
import Categories from '../modules/categories/Categories';
import {AutoComplete} from 'app/modules/product/components/autoComplete';
import {ImageSlider} from 'app/modules/imageSlider';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageSlider />
      <AutoComplete />
      <Divider />
      <View style={styles.categoryHeader}>
        <Text category="s2">Categorías</Text>
      </View>
      <Divider />
      <Categories />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    margin: 10,
    marginTop: 20,
  },
});

export default HomeScreen;
