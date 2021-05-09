import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {useTheme} from '@ui-kitten/components';
import {usePromoPosts} from 'app/hooks';

export const ImageSlider = () => {
  const theme = useTheme();
  const {images} = usePromoPosts();

  const primaryColor = theme['color-primary-default'];
  const disabled = theme['color-primary-disabled'];
  const background = theme['background-basic-color-3'];
  return (
    <SliderBox
      images={images}
      sliderBoxHeight={200}
      onCurrentImagePressed={(index: number) =>
        console.warn(`image ${index} pressed`)
      }
      dotColor={primaryColor}
      inactiveDotColor={disabled}
      paginationBoxVerticalPadding={20}
      autoplay
      circleLoop
      resizeMethod={'resize'}
      resizeMode={'cover'}
      paginationBoxStyle={{
        position: 'absolute',
        bottom: 0,
        padding: 0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
        padding: 0,
        margin: 0,
        backgroundColor: {background},
      }}
      ImageComponentStyle={{borderRadius: 15, width: '97%', marginTop: 5}}
      imageLoadingColor={primaryColor}
    />
  );
};
