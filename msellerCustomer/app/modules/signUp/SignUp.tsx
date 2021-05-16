import React from 'react';
import {Image, ImageProps, View} from 'react-native';
import {
  Button,
  CheckBox,
  Datepicker,
  Input,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIconOutline} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';

export const SignUp = (): React.ReactElement => {
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [dob, setDob] = React.useState<Date>();
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);

  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('signIn');
  };

  const renderCheckboxLabel = React.useCallback(
    evaProps => (
      <Text {...evaProps} style={styles.termsCheckBoxText}>
        By creating an account, I agree to the Ewa Terms of\nUse and Privacy
        Policy
      </Text>
    ),
    [],
  );

  return (
    <KeyboardAvoidingView>
      <ImageOverlay
        style={themedStyles.container}
        source={require('app/assets/images/image-background.jpg')}>
        <View style={styles.signUpContainer}>
          <Text style={styles.signInLabel} category="h4">
            Registro
          </Text>
          <Button
            style={styles.signInButton}
            appearance="ghost"
            size="giant"
            accessoryLeft={
              ArrowForwardIconOutline as RenderProp<Partial<ImageProps>>
            }
            onPress={onSignInButtonPress}>
            Ingresar
          </Button>
        </View>

        <View style={[themedStyles.container, styles.formContainer]}>
          <Image
            style={themedStyles.logo}
            source={require('app/assets/images/logo-mseller-dark.png')}
            resizeMode="contain"
          />
          <Input
            placeholder="Ally"
            label="FIRST NAME"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Input
            style={styles.formInput}
            placeholder="Watsan"
            label="LAST NAME"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
          />
          <Datepicker
            style={styles.formInput}
            placeholder="18/10/1995"
            label="Date of Birth"
            date={dob}
            onSelect={setDob}
          />
          <Input
            style={styles.formInput}
            placeholder="ally.watsan@gmail.com"
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={styles.formInput}
            label="PASSWORD"
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <CheckBox
            style={styles.termsCheckBox}
            checked={termsAccepted}
            onChange={(checked: boolean) => setTermsAccepted(checked)}>
            {renderCheckboxLabel}
          </CheckBox>
        </View>
        <Button
          style={styles.signUpButton}
          size="large"
          onPress={onSignUpButtonPress}>
          Completar Registro
        </Button>
      </ImageOverlay>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  logo: {
    height: 50,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  socialAuthContainer: {
    marginTop: 24,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginTop: 48,
    paddingHorizontal: 16,
  },
  evaButton: {
    maxWidth: 72,
    paddingHorizontal: 0,
  },
  signInLabel: {
    flex: 1,
  },
  signInButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
  },
  signUpButton: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  socialAuthIcon: {
    tintColor: 'text-basic-color',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 52,
  },
  divider: {
    flex: 1,
  },
  orLabel: {
    marginHorizontal: 8,
  },
  emailSignLabel: {
    alignSelf: 'center',
    marginTop: 8,
  },
  formInput: {
    marginTop: 16,
  },
  termsCheckBox: {
    marginTop: 20,
  },
  termsCheckBoxText: {
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
    marginLeft: 10,
  },
});
