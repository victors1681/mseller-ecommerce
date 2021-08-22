import AsyncStorage from '@react-native-async-storage/async-storage';
import {Maybe} from 'app/generated/graphql';

export const saveDefaultCreditCard = async (
  value: Maybe<string> | undefined,
) => {
  if (value) {
    await AsyncStorage.setItem('TrxToken', value);
  }
};

export const getDefaultCreditCard = async () => {
  const toke = await AsyncStorage.getItem('TrxToken');
  return toke;
};
