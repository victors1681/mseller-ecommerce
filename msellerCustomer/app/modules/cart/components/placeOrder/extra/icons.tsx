import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement} from '@ui-kitten/components';

export const CloseIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="close" />
);

export const MinusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="minus" />
);

export const PlusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="plus" />
);

export const CreditCardIcon = (style: any): IconElement => (
  <Icon {...style} fill="#8F9BB3" name="credit-card" />
);

export const CreditCardWhiteIcon = (style: any): IconElement => (
  <Icon {...style} name="credit-card" />
);

export const CheckIcon = (style: any): IconElement => (
  <Icon {...style} fill="#8F9BB3" name="checkmark-circle-outline" />
);
