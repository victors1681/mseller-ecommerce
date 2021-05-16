import * as Yup from 'yup';
require('yup-password')(Yup);
const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);

export const signUpValidationSchema = Yup.object({
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
