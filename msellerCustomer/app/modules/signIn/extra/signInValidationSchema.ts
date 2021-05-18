import * as Yup from 'yup';

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .email('Correo Electronico inválido')
    .required('Requerido'),
  password: Yup.string().required('Requerido'),
});
