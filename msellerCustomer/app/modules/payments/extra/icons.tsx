import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement} from '@ui-kitten/components';
import {Maybe} from 'app/generated/graphql';

export const CreditCardIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="credit-card" />
);

export const MoreVerticalIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="more-vertical" />
);

export const getLogo = (name?: Maybe<string> | undefined) => {
  if (name && name.toLocaleLowerCase() === 'visa') {
    return require('../assets/visa-logo.png');
  }
  require('../assets/mastercard-logo.png');
};
