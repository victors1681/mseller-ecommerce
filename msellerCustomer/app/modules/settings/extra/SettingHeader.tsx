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

  const name = `${customer.data?.customer?.firstName || ''} ${
    customer.data?.customer?.lastName || ''
  }`;
  const email = customer.data?.customer?.email || '';

  return (
    <View style={styles.container}>
      <SettingIcons name="account-circle" size={100} />
      <Text style={styles.text} appearance="hint" category="s1">
        {name}
      </Text>
      <Text style={styles.text} appearance="hint" category="p2">
        {email}
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
