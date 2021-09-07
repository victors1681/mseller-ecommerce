import React from 'react';
import {isTokenEmpty} from 'app/utils/tokenManagement';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
/**
 * Check if the token is set, if not it will take the user to signUp/signIn
 */
export const useUserLogged = () => {
  const navigation = useNavigation();
  /**
   * Validating User
   * Sent the user to signUp if token is empty
   */
  const resolveToken = async () => {
    const isEmpty = await isTokenEmpty();
    if (isEmpty) {
      navigation.navigate(ScreenLinks.SIGN_UP);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      resolveToken();
    }, []),
  );
};
