import {
  Button,
  ButtonGroup,
  InputProps,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components';
import {useField} from 'formik';
import React from 'react';

interface Options {
  label: string;
  value: string;
}
interface Props extends InputProps {
  name: string;
  options: Options[];
}
export const CustomButtonGroup = ({options, ...props}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, _, helpers] = useField(props as any);
  const styles = useStyleSheet(themedStyles);

  const {setValue} = helpers;

  const handleChange = (value: string) => setValue(value);

  return (
    <ButtonGroup status="basic" style={styles.buttonGroup}>
      {options &&
        options.map(o => {
          return (
            <Button
              style={[
                styles.button,
                field.value === o.value && styles.selectedBtn,
              ]}
              onPress={() => handleChange(o.value)}>
              {o.label}
            </Button>
          );
        })}
    </ButtonGroup>
  );
};

const themedStyles = StyleService.create({
  buttonGroup: {
    marginBottom: 20,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  selectedBtn: {
    backgroundColor: 'color-primary-default',
    textColor: 'white',
  },
});
