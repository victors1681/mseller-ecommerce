import {CheckBox, CheckBoxProps} from '@ui-kitten/components';
import {useField} from 'formik';
import React from 'react';

interface CustomCheckboxProps extends CheckBoxProps {
  name: string;
  value: boolean;
}
export const CustomCheckbox = ({children, ...props}: CustomCheckboxProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helper] = useField(props as any);

  const {setValue} = helper;
  return (
    <CheckBox
      checked={field.value}
      onChange={(checked: boolean) => setValue(checked)}>
      {children}
    </CheckBox>
  );
};
