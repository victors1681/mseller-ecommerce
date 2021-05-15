import React from 'react';
import {useCustomer} from 'app/hooks/useCustomer';
import {ScrollView} from 'react-native';
import {Button, StyleService, useStyleSheet} from '@ui-kitten/components';
import {ProfileAvatar} from './extra/profile-avatar.component';
import {ProfileSetting} from './extra/profile-setting.component';
import {CameraIcon} from './extra/icons';
import {Profile as DataProfile} from './extra/data';

import {Loading, Error} from '../common';

const data: DataProfile = DataProfile.jenniferGreen();

export const Profile = () => {
  const {customer, isLoading, error} = useCustomer();

  console.log('customer', customer);

  const styles = useStyleSheet(themedStyle);
  const renderPhotoButton = (): React.ReactElement => (
    <Button
      style={styles.editAvatarButton}
      status="basic"
      accessoryLeft={CameraIcon}
    />
  );

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
      <ProfileAvatar
        style={styles.profileAvatar}
        source={data.photo}
        editButton={renderPhotoButton}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="First Name"
        value={data.firstName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Last Name"
        value={data.lastName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Gender"
        value={data.gender}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Age"
        value={`${data.age}`}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Weight"
        value={`${data.weight} kg`}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Height"
        value={`${data.height} cm`}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Email"
        value={data.email}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Phone Number"
        value={data.phoneNumber}
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

export default Profile;
