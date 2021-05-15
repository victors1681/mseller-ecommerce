import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, AvatarProps, ButtonElement} from '@ui-kitten/components';
import {SettingIcons} from './icons';
import {useCustomer} from 'app/hooks';
export interface ProfileAvatarProps extends AvatarProps {
  editButton?: () => ButtonElement;
}

export const SettingHeader = (): React.ReactElement => {
  const customer = useCustomer();

  const name = `${customer.data?.Customer?.firstName || ''} ${
    customer.data?.Customer?.lastName || ''
  }`;

  return (
    <View style={styles.container}>
      <SettingIcons name="account-circle" size={100} />
      <Text style={styles.text} appearance="hint" category="s1">
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  text: {
    textAlign: 'center',
  },
});
