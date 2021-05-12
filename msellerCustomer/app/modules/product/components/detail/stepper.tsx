import {Input, Button} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MinusIcon, PlusIcon} from 'app/modules/common/Icons';

interface Props {
  setQty: React.Dispatch<React.SetStateAction<string | number>>;
  qty: string | number;
}
export const Stepper: React.FC<Props> = ({qty, setQty}) => {
  const decrementButtonEnabled = (): boolean => {
    return qty > 1;
  };

  const onMinusButtonPress = (): void => {
    setQty(prev => (prev as number) - 1);
  };

  const onPlusButtonPress = (): void => {
    setQty(prev => (prev as number) + 1);
  };

  const handleInput = (value: string) => {
    const parsed = parseInt(value as string, 16);
    console.log(parsed);
    if (isNaN(parsed)) {
      setQty('');
    } else {
      setQty(parsed);
    }
  };
  return (
    <View style={styles.amountContainer}>
      <Button
        style={[styles.iconButton, styles.amountButton]}
        size="tiny"
        accessoryLeft={MinusIcon as any}
        onPress={onMinusButtonPress}
        disabled={!decrementButtonEnabled()}
      />
      <Input
        style={styles.input}
        value={qty.toString()}
        size="small"
        onChangeText={handleInput}
      />
      <Button
        style={[styles.iconButton, styles.amountButton]}
        size="tiny"
        accessoryLeft={PlusIcon as any}
        onPress={onPlusButtonPress}
      />
    </View>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 40,
  },
  image: {
    width: 54,
    height: 54,
    margin: 5,
  },
  input: {
    width: 50,
    textAlign: 'center',
    justifyContent: 'center',
  },
  amountContainer: {
    //position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  amountButton: {
    margin: 5,
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  amount: {
    textAlign: 'center',
    width: 40,
  },
  removeButton: {
    //position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
