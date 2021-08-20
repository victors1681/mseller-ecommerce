import {Card, Modal as ModalView} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

export const Modal: React.FC = ({children, open, handleClose}) => {
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    setVisible(!open);
  }, [open]);

  return (
    <ModalView
      visible={true}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => handleClose()}>
      <Card disabled={true} style={styles.modalCard}>
        {children}
      </Card>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    minWidth: 240,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Modal;
