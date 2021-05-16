import React from 'react';
import {Image, ImageProps, View} from 'react-native';
import {
  Button,
  CheckBox,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {ImageOverlay} from 'app/modules/common/ImageOverlay';
import {ArrowForwardIconOutline} from './extra/icons';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {RenderProp} from '@ui-kitten/components/devsupport/components/falsyFC/falsyFC.component';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {CustomInput} from 'app/modules/common/form/CustomInput';
require('yup-password')(Yup);
const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);

const ValidationSchema = Yup.object({
  firstName: Yup.string().strict().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string()
    .email('Correo Electronico inválido')
    .required('Requerido'),
  password: Yup.string()
    .min(6, 'Clave debe tener al menos 6 letras')
    .minUppercase(1, 'Clave debe tener al menos una mayuscula')
    .required('Requerido'),

  phoneNumber: Yup.string()
    .matches(phoneRegex, 'Teléfono Inválido')
    .required('Requerido'),
  dob: Yup.object({
    day: Yup.number()
      .min(1, 'Día debe ser mayor 1')
      .max(31, 'Día debe ser menor a 31')
      .required('Requerido'),
    month: Yup.number()
      .min(1, 'Mes debe ser entre 1 - 12')
      .max(12, 'Mes debe ser entre 1 - 12')
      .required('Requerido'),
    year: Yup.number()
      .min(1900, 'Fecha de nacimiento incorrecta')
      .max(
        new Date().getFullYear() - 10,
        'Debe tener más de 10 años para usar esta aplicación',
      )
      .required('Requerido'),
  }),
});

export const SignUp = (): React.ReactElement => {
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(true);

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
        Al crear una cuenta, acepto los términos de uso y la política de
        privacidad.
      </Text>
    ),
    [],
  );

  const initialValues = {
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

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <KeyboardAvoidingView>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={onSubmit}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
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

            <View style={[styles.formContainer]}>
              <Image
                style={themedStyles.logo}
                source={require('app/assets/images/logo-mseller-dark.png')}
                resizeMode="contain"
              />
              <CustomInput
                name="firstName"
                value={values.firstName}
                label="NOMBRE"
                autoCapitalize="words"
              />
              <CustomInput
                name="lastName"
                style={styles.formInput}
                label="APELLIDO"
                autoCapitalize="words"
                value={values.lastName}
              />
              {/* <Datepicker
                style={styles.formInput}
                label="Fecha de Nacimiento"
                date={values.dob}
                onSelect={v => {
                  console.log('value', v);
                  handleChange('dob');
                }}
              /> */}
              <View style={[styles.dateContainer, styles.formInput]}>
                <CustomInput
                  name="dob.day"
                  style={[styles.dateItem, styles.rightSpace]}
                  label="Día"
                  placeholder="dd"
                  value={values.dob.day}
                />
                <CustomInput
                  name="dob.month"
                  style={styles.dateItem}
                  label="Mes"
                  placeholder="mm"
                  value={values.dob.month}
                />
                <CustomInput
                  name="dob.year"
                  style={[styles.dateItem, styles.leftSpace]}
                  label="Año"
                  placeholder="yyyy"
                  value={values.dob.year}
                />
              </View>
              {/* <CustomDatePicker label="Fecha de Nacimiento" name="bod" /> */}
              <CustomInput
                id="phoneNumber"
                name="phoneNumber"
                style={styles.formInput}
                label="TELEFONO"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('emphoneNumberail')}
                value={values.phoneNumber}
              />
              <CustomInput
                name="email"
                style={styles.formInput}
                label="EMAIL"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <CustomInput
                name="password"
                style={styles.formInput}
                label="CONTRASEÑA"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
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
              onPress={handleSubmit}>
              Completar Registro
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
