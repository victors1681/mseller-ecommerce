import React from 'react';
import {Icon, IconElement} from '@ui-kitten/components';
import {Maybe} from 'app/generated/graphql';

export const CreditCardIcon = (style: any): IconElement => (
  <Icon {...style} name="credit-card" />
);

export const MoreVerticalIcon = (style: any): JSX.Element => (
  <Icon {...style} name="more-vertical" />
);

export const getLogo = (name?: Maybe<string> | undefined) => {
  if (name && name.toLocaleLowerCase() === 'visa') {
    return require('../assets/visa-logo.png');
  }
  return require('../assets/mastercard-logo.png');
};

export const DeleteIcon = (props: any) => <Icon {...props} name="trash-2" />;

export const CheckIcon = (props: any) => (
  <Icon {...props} name="checkmark-circle-2" />
);

export const CheckDefaultIcon = (style: any): IconElement => (
  <Icon {...style} fill="white" name="checkmark-circle-outline" />
);
