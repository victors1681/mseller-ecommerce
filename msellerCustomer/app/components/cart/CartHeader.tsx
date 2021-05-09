import React from 'react';
import {Text, Layout, Button, Divider} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';

interface Props {
  navigation: DrawerNavigationHelpers;
}
export const CartHeader: React.FC<Props> = ({navigation}) => {
  const handleClose = () => {
    navigation.closeDrawer();
  };

  return (
    <Layout>
      <Layout style={styles.container}>
        <Layout style={styles.title}>
          <Text category="c2">Carrito de Compra</Text>
        </Layout>
        <Layout style={styles.layout}>
          <Button
            onPress={handleClose}
            style={styles.button}
            appearance="ghost"
            size="small">
            Cerrar
          </Button>
        </Layout>
      </Layout>
      <Divider />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  layout: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    margin: 4,
  },
});
