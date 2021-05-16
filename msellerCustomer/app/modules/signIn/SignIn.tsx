import React from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIcon} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';

export const SignIn = (): React.ReactElement => {
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  const navigation = useNavigation();
  const onSignInButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSignUpButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  return (
    <KeyboardAvoidingView>
      <ImageOverlay
        style={styles.container}
        source={require('app/assets/images/image-background.jpg')}>
        <View style={styles.signInContainer}>
          <Text style={styles.signInLabel} category="h4">
            Acceder
          </Text>
          <Button
            style={styles.signUpButton}
            appearance="ghost"
            size="giant"
            accessoryLeft={ArrowForwardIcon as RenderProp<Partial<ImageProps>>}
            onPress={onSignUpButtonPress}>
            Registro
          </Button>
        </View>
        <View style={styles.formContainer}>
          <Image
            style={styles.logo}
            source={require('app/assets/images/logo-mseller-dark.png')}
            resizeMode="contain"
          />
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={styles.passwordInput}
            secureTextEntry={true}
            placeholder="Contraseña"
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
          />
          <Button
            style={styles.session}
            size="large"
            onPress={onSignInButtonPress}>
            Iniciar Sessión
          </Button>
        </View>
      </ImageOverlay>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  session: {
    marginTop: 30,
  },
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logo: {
    height: 50,
    marginBottom: 30,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  socialAuthContainer: {
    marginTop: 48,
  },
  evaButton: {
    maxWidth: 72,
    paddingHorizontal: 0,
  },
  formContainer: {
    flex: 1,
    marginTop: 48,
  },
  passwordInput: {
    marginTop: 16,
  },
  signInLabel: {
    flex: 1,
  },
  signUpButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});
export default SignIn;
