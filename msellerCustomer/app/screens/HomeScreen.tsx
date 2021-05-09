import React from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Divider, Layout} from '@ui-kitten/components';
import Categories from '../modules/categories/Categories';
import {AutoComplete} from 'app/modules/product/components/autoComplete';
import {ImageSlider} from 'app/modules/imageSlider';

export const HomeScreen = ({navigation}) => {
  const navigateDetails = () => {
    navigation.navigate('Products');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageSlider />
      <AutoComplete />
      <Divider />
      <Categories />
    </SafeAreaView>
  );
};

export default HomeScreen;
