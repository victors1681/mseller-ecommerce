import React from 'react';
import {Image, ImageProps, View} from 'react-native';
import {Button, StyleService, Text, useStyleSheet} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIconOutline} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';
import {Formik, FormikHelpers} from 'formik';
import {signUpValidationSchema} from './extra/signUpValidationSchema';
import {CustomInput, CustomCheckbox} from 'app/modules/common/form';
import {LoadingIndicator} from 'app/modules/common';
import {useCustomer} from 'app/hooks';

export const SignUp = (): React.ReactElement => {
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);
  const {registerCustomer} = useCustomer();

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('signIn');
  };

  const renderCheckboxLabel = React.useCallback(
    evaProps => (
      <Text {...evaProps} style={styles.termsCheckBoxText}>
        Al crear una cuenta, acepto los términos de uso y la política de
        privacidad.
      </Text>
    ),
    [],
  );

  interface RegistrationFormProps {
    firstName: string;
    lastName: string;
    dob: {
      day: string;
      month: string;
      year: string;
    };
    phoneNumber: string;
    email: string;
    password: string;
    term: boolean;
  }
  const initialValues: RegistrationFormProps = {
    firstName: '',
    lastName: '',
    dob: {
      day: '',
      month: '',
      year: '',
    },
    phoneNumber: '',
    email: '',
    password: '',
    term: true,
  };

  const onSubmit = async (
    values: RegistrationFormProps,
    {setSubmitting, resetForm}: FormikHelpers<RegistrationFormProps>,
  ): Promise<void> => {
    const {firstName, lastName, dob, phoneNumber, email, password} = values;
    const bod = `${dob.month}-${dob.day}-${dob.year}`;
    const response = await registerCustomer({
      displayName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      password,
      billing: {
        firstName,
        lastName,
        phone: phoneNumber,
        email,
      },
      metaData: [{key: 'bod', value: bod}],
    });
    if (response) {
      setSubmitting(false);
      resetForm();
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView>
      <Formik
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}
        onSubmit={onSubmit}>
        {({handleSubmit, values, isSubmitting}) => (
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
                disabled={isSubmitting}
                accessoryLeft={
                  ArrowForwardIconOutline as RenderProp<Partial<ImageProps>>
                }
                onPress={onSignInButtonPress}>
                Ingresar
              </Button>
            </View>

            <View style={[styles.formContainer]}>
              <Image
                style={themedStyles.logo}
                source={require('app/assets/images/logo-mseller-dark.png')}
                resizeMode="contain"
              />
              <CustomInput
                name="firstName"
                disabled={isSubmitting}
                value={values.firstName}
                label="NOMBRE"
                autoCapitalize="words"
              />
              <CustomInput
                name="lastName"
                style={styles.formInput}
                disabled={isSubmitting}
                label="APELLIDO"
                autoCapitalize="words"
                value={values.lastName}
              />
              <View style={[styles.dateContainer, styles.formInput]}>
                <CustomInput
                  name="dob.day"
                  style={[styles.dateItem, styles.rightSpace]}
                  disabled={isSubmitting}
                  label="Día"
                  placeholder="dd"
                  value={values.dob.day}
                  keyboardType="number-pad"
                />
                <CustomInput
                  name="dob.month"
                  style={styles.dateItem}
                  disabled={isSubmitting}
                  label="Mes"
                  placeholder="mm"
                  value={values.dob.month}
                  keyboardType="number-pad"
                />
                <CustomInput
                  name="dob.year"
                  style={[styles.dateItem, styles.leftSpace]}
                  disabled={isSubmitting}
                  label="Año"
                  placeholder="yyyy"
                  value={values.dob.year}
                  keyboardType="number-pad"
                />
              </View>
              <CustomInput
                name="phoneNumber"
                style={styles.formInput}
                disabled={isSubmitting}
                label="TELEFONO"
                value={values.phoneNumber}
                keyboardType="phone-pad"
              />
              <CustomInput
                name="email"
                style={styles.formInput}
                disabled={isSubmitting}
                label="EMAIL"
                value={values.email}
                keyboardType="email-address"
              />
              <CustomInput
                name="password"
                style={styles.formInput}
                label="CONTRASEÑA"
                secureTextEntry={true}
                value={values.password}
              />
              <CustomCheckbox
                name="term"
                value={values.term}
                disabled={isSubmitting}
                style={styles.termsCheckBox}>
                {renderCheckboxLabel}
              </CustomCheckbox>
            </View>
            <Button
              disabled={!values.term || isSubmitting}
              style={styles.signUpButton}
              size="large"
              accessoryLeft={(isSubmitting ? LoadingIndicator : null) as any}
              onPress={handleSubmit}>
              {isSubmitting ? 'Creando Nueva Cuenta' : 'Completar Registro'}
            </Button>
          </ImageOverlay>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  logo: {
    height: 50,
    marginBottom: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    flexFlow: 'column wrap',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
  },
  rightSpace: {
    marginRight: 10,
  },
  leftSpace: {
    marginLeft: 10,
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
