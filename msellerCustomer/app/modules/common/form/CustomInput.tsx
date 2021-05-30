import {Input, InputProps} from '@ui-kitten/components';
import {useField} from 'formik';
import {omit} from 'lodash';
import React from 'react';

interface CustomInputProps extends InputProps {
  label: string;
  name: string;
}
export const CustomInput = ({label, ...props}: CustomInputProps) => {
  const [field, meta] = useField(props as any);

  const isError = meta.touched && meta.error;
  const caption = isError ? meta.error : undefined;

  const status = isError ? 'danger' : undefined;
  return (
    <Input
      label={label}
      {...omit(field, 'onChange')}
      {...props}
      onChangeText={field.onChange(field.name)}
      onBlur={field.onBlur(field.name)}
      status={status}
      caption={caption}
    />
  );
};
