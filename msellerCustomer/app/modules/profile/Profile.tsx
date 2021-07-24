import React from 'react';
import {useCustomer} from 'app/hooks/useCustomer';
import {ScrollView} from 'react-native';
import {Button, StyleService, useStyleSheet} from '@ui-kitten/components';
import {SettingHeader} from 'app/modules/settings/extra/SettingHeader';
import {ProfileSetting} from './extra/profile-setting.component';

import {Loading, Error} from '../common';

export const Profile = () => {
  const {customer, isLoading, error} = useCustomer();

  const firstName = customer?.firstName || '';
  const lastName = customer?.lastName || '';
  const email = customer?.email || '';
  const phoneNumber = customer?.billing?.phone || '';

  const styles = useStyleSheet(themedStyle);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <SettingHeader />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Nombre"
        value={firstName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Apellido"
        value={lastName}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Cuenta"
        value={'12222'}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Condición Pago"
        value={'Credito'}
      />

      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Email"
        value={email}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Teléfono"
        value={phoneNumber}
      />
      <Button style={styles.doneButton} appearance="outline">
        Cambiar Contraseña
      </Button>
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

export default Profile;
