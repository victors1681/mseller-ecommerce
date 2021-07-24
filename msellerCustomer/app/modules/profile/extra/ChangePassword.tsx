import {
  Card,
  Icon,
  IconElement,
  StyleService,
  useStyleSheet,
  Button,
  Modal,
  Text,
} from '@ui-kitten/components';
import {UpdateCustomerInput} from 'app/generated/graphql';
import {useCustomer} from 'app/hooks';
import {LoadingIndicatorWhite} from 'app/modules/common';
import {CustomInput} from 'app/modules/common/form';
import {Formik} from 'formik';
import React from 'react';
import {Alert, ImageStyle, Keyboard} from 'react-native';
import * as Yup from 'yup';
require('yup-password')(Yup);
export const CloseIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="close" />
);

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Clave debe tener al menos 6 letras')
    .minUppercase(1, 'Clave debe tener al menos una mayuscula')
    .required('Contraseña Requerida'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'La contraseña no coincide',
  ),
});

interface IForm {
  password: string;
  passwordConfirmation: string;
}
interface IResponse {
  data: UpdateCustomerInput;
}
export const ChangePassword = () => {
  const styles = useStyleSheet(themedStyle);
  const [visible, setVisible] = React.useState(false);
  const [keyboardSize, setKeyboardSize] = React.useState(0);

  const {updateCustomer} = useCustomer();

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardSize(e.endCoordinates.height);
    });

    Keyboard.addListener('keyboardDidHide', e => {
      setKeyboardSize(e.endCoordinates.height);
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const isSuccess = (arg: any): arg is IResponse => {
    return arg.data !== undefined;
  };

  const handleSubmission = async (values: IForm) => {
    const payload: UpdateCustomerInput = {
      password: values.password,
    };
    const response = await updateCustomer(payload);

    if (isSuccess(response)) {
      setVisible(false);
    } else {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
      console.error(response);
    }
  };

  return (
    <>
      <Button
        style={styles.doneButton}
        appearance="outline"
        onPress={() => setVisible(true)}>
        Cambiar Contraseña
      </Button>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{password: '', passwordConfirmation: ''}}
          onSubmit={handleSubmission}>
          {({handleSubmit, isSubmitting, values}) => (
            <Card
              disabled={true}
              style={[{marginBottom: keyboardSize}, styles.modalCard]}>
              <Button
                style={[styles.iconButton, styles.removeButton]}
                appearance="ghost"
                status="basic"
                accessoryLeft={CloseIcon as any}
                onPress={() => setVisible(false)}
              />
              <Text category="h6" style={styles.marginHeader}>
                Cambio de contraseña
              </Text>
              <CustomInput
                name="password"
                disabled={isSubmitting}
                value={values.password}
                label="CONTRASEÑA"
                secureTextEntry
              />
              <CustomInput
                name="passwordConfirmation"
                disabled={isSubmitting}
                value={values.passwordConfirmation}
                label="CONFIRME CONTRASEÑA"
                secureTextEntry
              />

              <Button
                style={styles.sendBtn}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessoryLeft={isSubmitting && (LoadingIndicatorWhite as any)}>
                CAMBIAR CONTRASEÑA
              </Button>
            </Card>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const themedStyle = StyleService.create({
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  sendBtn: {
    marginTop: 10,
  },
  modalCard: {
    minWidth: 310,
  },
  margin: {
    marginBottom: 10,
  },
  marginHeader: {
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  iconButton: {
    paddingHorizontal: 0,
    margin: 0,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
