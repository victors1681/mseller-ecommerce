import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import onlineShopping from 'app/assets/images/online-shopping.png';
import {useNavigation} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

interface Props {
  message: string | undefined;
  enableBtn?: boolean;
}
export const Empty: React.FC<Props> = ({message, enableBtn}) => {
  const navigation = useNavigation();

  const handleButton = () => {
    navigation.navigate(ScreenLinks.HOME);
  };
  return (
    <View style={styles.wrapper}>
      <Image
        style={styles.image}
        source={onlineShopping}
        resizeMode="contain"
      />
      <Text category="c2">{message}</Text>
      {enableBtn && (
        <Button onPress={handleButton} style={styles.buyBtn}>
          Ir al catálogo
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 135 / 76,
    margin: 50,
  },
  buyBtn: {
    marginTop: 10,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Empty.defaultProps = {
  enableBtn: true,
};

export default Empty;
