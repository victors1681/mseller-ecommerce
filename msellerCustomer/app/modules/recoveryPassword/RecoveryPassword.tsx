import React from 'react';
import {
  Alert,
  AlertButton,
  Image,
  ImageProps,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIcon} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';
import {Formik, FormikHelpers} from 'formik';
import {LoadingIndicator} from 'app/modules/common';
import {CustomInput} from 'app/modules/common/form';
import {RecoveryValidationSchema} from './extra/RecoveryValidationSchema';
import {useCustomer} from 'app/hooks';

import Toast from 'react-native-toast-message';

interface RecoveryPasswordFormProps {
  email: string;
}
const initialValues: RecoveryPasswordFormProps = {
  email: '',
};

export const RecoveryPassword = (): React.ReactElement => {
  const navigation = useNavigation();
  const {performRecoveryPassword} = useCustomer();
  const onSignUpButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSubmit = async (
    values: RecoveryPasswordFormProps,
    {setSubmitting, resetForm}: FormikHelpers<RecoveryPasswordFormProps>,
  ): Promise<void> => {
    const {email} = values;

    const response = await performRecoveryPassword({
      username: email,
    });

    if (response) {
      setSubmitting(false);
      resetForm();

      const alertBtn: AlertButton = {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      };
      Alert.alert(
        'Restaurar Contraseña',
        `Se generó un correo electónico a ${email}. Revise su correo electrónico y bandeja de no deseados para restablecer la contraseña`,
        [alertBtn],
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'Usuario Incorrecto',
      });
    }
  };

  return (
    <KeyboardAvoidingView>
      <Formik
        initialValues={initialValues}
        validationSchema={RecoveryValidationSchema}
        onSubmit={onSubmit}>
        {({handleSubmit, values, isSubmitting}) => (
          <ImageOverlay
            style={styles.container}
            source={require('app/assets/images/image-background.jpg')}>
            <View style={styles.signInContainer}>
              <Text style={styles.signInLabel} category="h4">
                Contraseña
              </Text>
              <Button
                style={styles.signUpButton}
                appearance="ghost"
                size="giant"
                accessoryLeft={
                  ArrowForwardIcon as RenderProp<Partial<ImageProps>>
                }
                onPress={onSignUpButtonPress}>
                Acceder
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
              <Button
                disabled={!values.email || isSubmitting}
                style={styles.session}
                size="large"
                accessoryLeft={(isSubmitting ? LoadingIndicator : null) as any}
                onPress={handleSubmit}>
                {isSubmitting
                  ? 'Restaurando Contraseña'
                  : 'Restaurar Contraseña'}
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
export default RecoveryPassword;
