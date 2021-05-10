import React from 'react';
import {Icon, StyleService, useTheme} from '@ui-kitten/components';
import {View, Text} from 'react-native';

interface IconWithBadgeProps {
  number?: string | number;
}
export const IconWithBadge: React.FC<IconWithBadgeProps> = ({number}) => {
  const theme = useTheme();
  return (
    <View style={styles.wrapper}>
      <Icon
        style={styles.icon}
        name="shopping-cart-outline"
        fill={theme['color-primary-default']}
      />
      {number ? (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{number}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleService.create({
  icon: {
    width: 24,
    height: 24,
  },
  wrapper: {paddingLeft: 20, paddingRight: 20},
  badgeContainer: {
    height: 12,
    width: 12,
    backgroundColor: 'color-primary-700',
    borderRadius: 10,
    position: 'absolute',
    right: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 8,
  },
});
