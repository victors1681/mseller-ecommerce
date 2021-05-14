import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text} from '@ui-kitten/components';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Divider />
      <View style={styles.categoryHeader}>
        <Text category="s2">Categorías</Text>
      </View>
      <Divider />
      <Text>Profile</Text>
    </SafeAreaView>
  );
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
