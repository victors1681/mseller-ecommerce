import React from 'react';
import {
  Alert,
  Image,
  ImageProps,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import {Button, Text} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIcon} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {StackActions, useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';
import {Formik, FormikHelpers} from 'formik';
import {LoadingIndicator} from 'app/modules/common';
import {CustomInput} from 'app/modules/common/form';
import {signInValidationSchema} from './extra/signInValidationSchema';
import {useCustomer} from 'app/hooks';
import FRDatabase from 'app/services/FRDatabase';

interface LoginFormProps {
  email: string;
  password: string;
}
const initialValues: LoginFormProps = {
  email: '',
  password: '',
};

export const SignIn = (): React.ReactElement => {
  const navigation = useNavigation();
  const {login} = useCustomer();
  const onSignUpButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSubmit = async (
    values: LoginFormProps,
    {setSubmitting, resetForm}: FormikHelpers<LoginFormProps>,
  ): Promise<void> => {
    const {email, password} = values;

    const response = await login({
      username: email,
      password,
    });

    if (response) {
      const customer = response.data?.login?.customer;

      if (customer) {
        const db = new FRDatabase();
        const options = {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        };
        await db.saveToken(customer.id, options);
      }

      setSubmitting(false);
      resetForm();
      navigation.dispatch(StackActions.popToTop());
      navigation.goBack();
    } else {
      Alert.alert('Usuario/contraseña incorrecta');
    }
  };

  const handleKeyDown = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
  ) => {
    console.log('tess');
    if (e.nativeEvent.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <KeyboardAvoidingView>
      <Formik
        initialValues={initialValues}
        validationSchema={signInValidationSchema}
        onSubmit={onSubmit}>
        {({handleSubmit, values, isSubmitting}) => (
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
                accessoryLeft={
                  ArrowForwardIcon as RenderProp<Partial<ImageProps>>
                }
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

              <CustomInput
                name="email"
                disabled={isSubmitting}
                label="EMAIL"
                value={values.email}
                keyboardType="email-address"
              />
              <CustomInput
                name="password"
                style={styles.passwordInput}
                label="CONTRASEÑA"
                secureTextEntry={true}
                onKeyPress={e => handleKeyDown(e, handleSubmit)}
                value={values.password}
              />
              <Button
                disabled={(!values.email && !values.password) || isSubmitting}
                style={styles.session}
                size="large"
                accessoryLeft={(isSubmitting ? LoadingIndicator : null) as any}
                onPress={handleSubmit}>
                {isSubmitting ? 'Iniciando Sessión' : 'Iniciar Sessión'}
              </Button>
            </View>
          </ImageOverlay>
        )}
      </Formik>
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
