import * as Yup from 'yup';

export const RecoveryValidationSchema = Yup.object({
  email: Yup.string()
    .email('Correo Electronico inválido')
    .required('Requerido'),
});
