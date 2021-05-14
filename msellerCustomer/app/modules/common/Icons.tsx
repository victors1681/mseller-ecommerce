import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement, useTheme} from '@ui-kitten/components';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CartIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="shopping-cart" />
);
export const CloseIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="close" />
);

export const MinusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="minus" />
);

export const PlusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="plus" />
);

const ICON_SIZE = 20;

interface MaterialIconProps {
  name: string;
  size?: number;
}
export const MaterialIcons: React.FC<MaterialIconProps> = ({
  name,
  size = ICON_SIZE,
}) => {
  const theme = useTheme();
  return (
    <MaterialCommunityIcon
      name={name} //"storefront-outline" receipt account-circle-outline
      size={size}
      color={theme['color-primary-default']}
    />
  );
};

export const StoreIcon = (props: any) => {
  return (
    <MaterialCommunityIcon
      name={'storefront-outline'} //"storefront-outline" receipt account-circle-outline
      size={props.style.height}
      color={props.style.tintColor}
    />
  );
};

export const OrderIcon = (props: any) => {
  return (
    <MaterialCommunityIcon
      name={'receipt'} //"storefront-outline" receipt account-circle-outline
      size={props.style.height}
      color={props.style.tintColor}
    />
  );
};

export const ProfileIcon = (props: any) => {
  return (
    <MaterialCommunityIcon
      name={'account-circle-outline'} //"storefront-outline" receipt account-circle-outline
      size={props.style.height}
      color={props.style.tintColor}
    />
  );
};
