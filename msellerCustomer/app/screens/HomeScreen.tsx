import React from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';
import Categories from '../modules/categories/Categories';

export const HomeScreen = ({navigation}) => {
  const navigateDetails = () => {
    navigation.navigate('Products');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Divider />
      <Categories />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={navigateDetails}>OPEN DETAILS</Button>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeScreen;
