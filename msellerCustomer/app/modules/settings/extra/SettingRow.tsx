import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Layout, Text, LayoutProps} from '@ui-kitten/components';
import {SettingIcons} from './icons';
export interface SettingRowsProps extends LayoutProps {
  hint: string;
  iconName?: string;
  chevron?: boolean;
  onPress?: () => void;
}

export const SettingRow = (props: SettingRowsProps): React.ReactElement => {
  const {style, hint, iconName, chevron, onPress, ...layoutProps} = props;

  return (
    <React.Fragment>
      <TouchableOpacity onPress={onPress && onPress}>
        <Layout level="1" {...layoutProps} style={[styles.container, style]}>
          {iconName && <SettingIcons name={iconName} />}
          <Text style={styles.title} appearance="hint" category="s1">
            {hint}
          </Text>
          <View style={styles.space} />
          {chevron && <SettingIcons name="chevron-right" />}
        </Layout>
      </TouchableOpacity>
      <Divider />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  space: {
    flex: 1,
  },
  title: {
    paddingLeft: 10,
  },
});
