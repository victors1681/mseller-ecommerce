import * as Yup from 'yup';
import {LocationType} from '../Address';

export const addressSchema = Yup.object({
  locationType: Yup.string().strict().required('Requerido'),
  address1: Yup.string().required('Requerido'),
  address2: Yup.string().required('Requerido'),
  city: Yup.string().required('Requerido'),
  state: Yup.string().required('Requerido'),
  homeNumber: Yup.string().when('locationType', {
    is: (value: string) => value === LocationType.HOME,
    then: s => s.required('Requerido'),
  }),
  buildingName: Yup.string().when('locationType', {
    is: (value: string) => value === LocationType.BUILDING,
    then: s => s.required('Requerido'),
  }),
  apartmentNumber: Yup.string().when('locationType', {
    is: (value: string) => value === LocationType.BUILDING,
    then: s => s.required('Requerido'),
  }),
  company: Yup.string().when('locationType', {
    is: (value: string) => value === LocationType.BUSINESS,
    then: s => s.required('Requerido'),
  }),
});
