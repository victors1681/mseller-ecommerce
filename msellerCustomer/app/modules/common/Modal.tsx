import {Card, Modal} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

export const Loading: React.FC = ({children}) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}>
      <Card disabled={true} style={styles.modalCard}>
        {children}
      </Card>
    </Modal>
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

export default Loading;
