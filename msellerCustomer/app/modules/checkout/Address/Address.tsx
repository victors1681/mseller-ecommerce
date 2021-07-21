import React from 'react';
import {View} from 'react-native';
import {
  Text,
  Button,
  Layout,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import {Formik, FormikHelpers} from 'formik';
import {addressSchema} from './extra/addressSchema';
import {CustomInput, CustomButtonGroup} from 'app/modules/common/form';
import {LoadingIndicator} from 'app/modules/common';
import {useCustomer} from 'app/hooks';
import {getMetadataFromJson} from 'app/utils';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {useUserLogged} from 'app/hooks';

export enum LocationType {
  HOME = 'home',
  BUILDING = 'building',
  BUSINESS = 'business',
}

export const Address = (): React.ReactElement => {
  const navigation = useNavigation();
  const route = useRoute();
  const styles = useStyleSheet(themedStyles);
  const {updateCustomer, customer, fetchCustomer, isLoading} = useCustomer();

  const {backOnSave} = (route.params || {}) as any;

  //Check if the user is logged
  useUserLogged();

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomer();
    }, [fetchCustomer]),
  );

  const performNavigation = React.useCallback((): void => {
    if (backOnSave) {
      navigation?.goBack();
    } else {
      navigation?.navigate(ScreenLinks.PLACE_ORDER);
    }
  }, [navigation, backOnSave]);

  interface RegistrationFormProps {
    locationType: LocationType;
    address1: string;
    address2: string;
    state: string;
    company: string;
    homeNumber?: string;
    buildingName?: string;
    apartmentNumber?: string;
    city: string;
  }

  interface ShippingMetaData {
    homeNumber?: string;
    buildingName?: string;
    apartmentNumber?: string;
    locationType: LocationType;
  }

  const onSubmit = React.useCallback(
    async (
      values: RegistrationFormProps,
      {setSubmitting, resetForm}: FormikHelpers<RegistrationFormProps>,
    ): Promise<void> => {
      if (!customer?.id) {
        console.error('User ID is not present or user is not logged');
        return;
      }
      const {
        address1,
        address2,
        state,
        city,
        company,
        locationType,
        homeNumber,
        buildingName,
        apartmentNumber,
      } = values;

      //Composing Additional metadata
      const metaData = JSON.stringify({
        locationType,
        homeNumber,
        buildingName,
        apartmentNumber,
      });

      const response = await updateCustomer({
        id: customer.id, // Need customer id to be able to update metaData //graphql-woocommerce issue. https://github.com/wp-graphql/wp-graphql-woocommerce/issues/420
        shipping: {
          address1,
          address2,
          state,
          company,
          city,
        },
        metaData: [{key: 'shipping', value: metaData}],
      });

      if (response) {
        setSubmitting(false);
        resetForm();
        performNavigation();
      }
    },
    [customer?.id, performNavigation, updateCustomer],
  );

  const metaData = getMetadataFromJson(
    customer?.metaData,
    'shipping',
  ) as ShippingMetaData;

  const initialValues: RegistrationFormProps = {
    locationType: metaData?.locationType || LocationType.HOME,
    address1: customer?.shipping?.address1 || '',
    address2: customer?.shipping?.address2 || '',
    company: customer?.shipping?.company || '',
    state: customer?.shipping?.state || '',
    homeNumber: metaData?.homeNumber || '',
    buildingName: metaData?.buildingName || '',
    apartmentNumber: metaData?.apartmentNumber || '',
    city: customer?.shipping?.city || '',
  };

  return (
    <KeyboardAvoidingView>
      <Formik
        enableReinitialize
        disabled={true}
        initialValues={initialValues}
        validationSchema={addressSchema}
        onSubmit={onSubmit}>
        {({handleSubmit, values, isSubmitting}) => (
          <Layout>
            <View style={[styles.formContainer]}>
              <Text style={styles.switch} category="s1">
                Elija un destino del pedido
              </Text>
              <CustomButtonGroup
                disabled={isSubmitting || isLoading}
                name="locationType"
                value={values.locationType}
                options={[
                  {label: 'Casa', value: 'home'},
                  {label: 'Edificio', value: 'building'},
                  {label: 'Negocio', value: 'business'},
                ]}
              />

              <CustomInput
                name="address1"
                style={styles.formInput}
                disabled={isSubmitting || isLoading}
                value={values.address1}
                label="CALLE"
              />
              <CustomInput
                name="state"
                style={styles.formInput}
                disabled={isSubmitting || isLoading}
                value={values.state}
                label="SECTOR"
              />
              {values.locationType === LocationType.HOME && (
                <CustomInput
                  name="homeNumber"
                  style={styles.formInput}
                  disabled={isSubmitting || isLoading}
                  value={values.homeNumber}
                  label="NÚMERO DE CASA"
                  keyboardType="number-pad"
                />
              )}

              {values.locationType === LocationType.BUILDING && (
                <CustomInput
                  name="buildingName"
                  style={styles.formInput}
                  disabled={isSubmitting || isLoading}
                  value={values.buildingName}
                  label="NOMBRE DEL EDIFICIO"
                />
              )}
              {values.locationType === LocationType.BUILDING && (
                <CustomInput
                  name="apartmentNumber"
                  style={styles.formInput}
                  disabled={isSubmitting || isLoading}
                  value={values.apartmentNumber}
                  label="APERTAMENTO"
                  keyboardType="number-pad"
                />
              )}
              {values.locationType === LocationType.BUSINESS && (
                <CustomInput
                  name="company"
                  style={styles.formInput}
                  disabled={isSubmitting || isLoading}
                  value={values.company}
                  label="NOMBRE DE LA EMPRESA"
                />
              )}
              <CustomInput
                name="city"
                style={styles.formInput}
                disabled={isSubmitting || isLoading}
                label="CIUDAD"
                value={values.city}
              />
              <CustomInput
                name="address2"
                numberOfLines={4}
                multiline
                style={styles.formInput}
                disabled={isSubmitting || isLoading}
                placeholder="Cerca de... casa color..."
                label="AGREGAR INTRUCCIONES"
                value={values.address2}
              />
            </View>
            <Button
              disabled={isSubmitting || isLoading}
              style={styles.signUpButton}
              size="large"
              accessoryLeft={
                (isSubmitting || isLoading ? LoadingIndicator : null) as any
              }
              onPress={handleSubmit}>
              {isLoading
                ? 'Cargando Informacion...'
                : isSubmitting
                ? 'Guardando'
                : 'Guardar y Continuar'}
            </Button>
          </Layout>
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
  switch: {
    marginVertical: 8,
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
