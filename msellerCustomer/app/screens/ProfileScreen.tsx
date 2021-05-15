import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text} from '@ui-kitten/components';
import {Profile} from 'app/modules/profile';

export const ProfileScreen = () => {
  return <Profile />;
};

const styles = StyleSheet.create({
  container: {flex: 1},
  categoryHeader: {
    margin: 10,
    marginTop: 20,
  },
  autoComplete: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ProfileScreen;
