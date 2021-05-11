import {Input, Button} from '@ui-kitten/components';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MinusIcon, PlusIcon} from 'app/modules/common/Icons';

interface Props {}
export const Loading: React.FC<Props> = () => {
  const [qty, setQty] = useState(1);

  const decrementButtonEnabled = (): boolean => {
    return qty > 1;
  };

  const onMinusButtonPress = (): void => {
    setQty(prev => prev - 1);
  };

  const onPlusButtonPress = (): void => {
    setQty(prev => prev + 1);
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
        value={qty.toString()}
        size="small"
        onChangeText={nextValue => setQty(parseInt(nextValue))}
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

export default Loading;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 100,
  },
  image: {
    width: 54,
    height: 54,
    margin: 5,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  amountContainer: {
    position: 'absolute',
    flexDirection: 'row',
    left: 16,
    bottom: 16,
  },
  amountButton: {
    borderRadius: 12,
  },
  amount: {
    textAlign: 'center',
    width: 40,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
