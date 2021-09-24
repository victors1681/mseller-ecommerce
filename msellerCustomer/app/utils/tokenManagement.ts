import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from 'lodash/isEmpty';
import {client} from 'app/services/apolloClient';
export interface TokenResponse {
  authToken: string;
  refreshToken: string;
  sessionToken: string;
}

const TOKEN_NAME = 'authToken';

/**
 * Save auth Token
 * @param token
 * @param refreshToken
 */
export const saveToken = async ({
  authToken,
  refreshToken,
  sessionToken,
}: TokenResponse): Promise<void> => {
  try {
    const value: TokenResponse = {
      authToken,
      refreshToken,
      sessionToken,
    };
    const strToken = JSON.stringify(value);
    await AsyncStorage.setItem(TOKEN_NAME, strToken);
  } catch (err) {
    console.error('Saving Token Error ', err);
  }
};

/**
 * Get Authorization object
 * @returns { token, refreshToken}
 */
export const getToken = async (): Promise<TokenResponse | undefined> => {
  try {
    const data = await AsyncStorage.getItem(TOKEN_NAME);
    if (data) {
      return JSON.parse(data) as TokenResponse;
    }
  } catch (err) {
    console.error('Error', err);
  }
};

/**
 * Update Token
 * @param authToken
 */
export const updateToken = async (authToken: string): Promise<void> => {
  try {
    const currentToken = await getToken();
    const newTokenValues = {...currentToken, authToken};

    if (newTokenValues?.refreshToken && newTokenValues?.sessionToken) {
      saveToken(newTokenValues as TokenResponse);
    }
  } catch (err) {
    console.error('Error updating token ', err);
  }
};

/**
 * Remove token after logout
 */

export const resetToken = async () => {
  try {
    await AsyncStorage.clear();
    await client.resetStore();
  } catch (err) {
    console.error('error resetting token', err);
  }
};

export const isTokenEmpty = async (): Promise<Boolean> => {
  const token = await getToken();
  return isEmpty(token);
};
