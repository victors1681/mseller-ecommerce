import React from 'react';
import {ScrollView} from 'react-native';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import {SettingHeader} from './extra/SettingHeader';
import {SettingRow} from './extra/SettingRow';
import {useCustomer} from 'app/hooks/useCustomer';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {isTokenEmpty} from 'app/utils/tokenManagement';
export const Settings = () => {
  const navigation = useNavigation();
  const {fetchCustomer, performLogout} = useCustomer();
  const styles = useStyleSheet(themedStyle);

  const navigateTo = (destination: string, params?: any) => () =>
    navigation.navigate(destination, params);

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomer();
    }, [fetchCustomer]),
  );

  /**
   * Validating User
   * Sent the user to signUp if token is empty
   */
  const resolveToken = async () => {
    const isEmpty = await isTokenEmpty();
    if (isEmpty) {
      navigation.navigate('signUp');
    }
  };
  React.useEffect(() => {
    resolveToken();
  });

  const handleLogout = () => {
    performLogout();
    fetchCustomer();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <SettingHeader />
      <SettingRow
        style={[styles.profileSetting, styles.section]}
        hint="Tú Perfil"
        chevron
        iconName="account-circle-outline"
        onPress={navigateTo('profile')}
      />
      <SettingRow
        style={styles.profileSetting}
        hint="Direcciones"
        chevron
        iconName="map-marker-radius"
        onPress={navigateTo('signUp')}
      />
      <SettingRow
        style={styles.profileSetting}
        hint="Método de Pago"
        chevron
        iconName="credit-card-outline"
      />
      <SettingRow
        style={[styles.profileSetting, styles.section]}
        hint="Contacto"
        iconName="email-outline"
      />
      <SettingRow
        style={styles.profileSetting}
        hint="Acerca de Mobile Seller"
        iconName="information-variant"
        chevron
      />
      <SettingRow
        style={[styles.profileSetting, styles.section]}
        hint="Cerrar Sessión"
        onPress={handleLogout}
        iconName="logout"
      />
    </ScrollView>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 124,
    alignSelf: 'center',
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 48,
    borderRadius: 24,
  },
  profileSetting: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});

export default Settings;
