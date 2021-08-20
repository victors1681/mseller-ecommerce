import {ImageSourcePropType} from 'react-native';

export class PaymentCard {
  constructor(
    readonly number: string,
    readonly logo: ImageSourcePropType,
    readonly cardholderName: string,
    readonly expireDate: string,
  ) {}

  static emilyClarckVisa(): PaymentCard {
    return new PaymentCard(
      '**** **** **** 4560',
      require('../assets/mastercard-logo.png'),
      'Emily Clarck',
      '10/22',
    );
  }
}
