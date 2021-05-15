import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement, useTheme} from '@ui-kitten/components';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CameraIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="camera" />
);

const ICON_SIZE = 20;

interface MaterialIconProps {
  name: string;
  size?: number;
}

export const SettingIcons: React.FC<MaterialIconProps> = ({
  name,
  size = ICON_SIZE,
}) => {
  const theme = useTheme();
  return (
    <MaterialCommunityIcon
      name={name}
      size={size}
      color={theme['text-hint-color']}
    />
  );
};
