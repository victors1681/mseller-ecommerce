import {Datepicker} from '@ui-kitten/components';
import {useField} from 'formik';
import React from 'react';

interface CustomDatePickerProps {
  label: string;
}
export const CustomDatePicker = ({label, ...props}: CustomDatePickerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField(props as any);
  const {setValue} = helpers;

  return (
    <>
      <Datepicker
        label={label}
        date={field.value}
        {...props}
        onSelect={v => setValue(v)}
      />
    </>
  );
};
