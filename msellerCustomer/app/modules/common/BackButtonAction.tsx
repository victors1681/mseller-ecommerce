import React from 'react';

import {Icon, TopNavigationAction} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/core';
const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export const BackButtonAction = () => {
  const navigation = useNavigation();

  return (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );
};
