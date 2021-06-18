import React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import {StyleService, useStyleSheet} from '@ui-kitten/components';
import {SettingHeader} from './extra/SettingHeader';
import {SettingRow} from './extra/SettingRow';
import {useCustomer} from 'app/hooks/useCustomer';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useUserLogged} from 'app/hooks';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {SafeAreaView} from 'react-native-safe-area-context';
export const Settings = () => {
  const navigation = useNavigation();
  const {fetchCustomer, performLogout} = useCustomer();
  const styles = useStyleSheet(themedStyle);
  useUserLogged();

  const navigateTo = (destination: string, params?: any) => () =>
    navigation.navigate(destination, params);

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomer();
    }, [fetchCustomer]),
  );

  const handleLogout = () => {
    performLogout();
    fetchCustomer();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <StatusBar />
      <SettingHeader />
      <SettingRow
        style={[styles.profileSetting, styles.section]}
        hint="Tú Perfil"
        chevron
        iconName="account-circle-outline"
        onPress={navigateTo(ScreenLinks.PROFILE)}
      />
      <SettingRow
        style={styles.profileSetting}
        hint="Direcciones"
        chevron
        iconName="map-marker-radius"
        onPress={navigateTo(ScreenLinks.ADDRESS, {backOnSave: 'true'})}
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
