import React from 'react';
import {ImageBackground, Platform, View} from 'react-native';
import {
  Button,
  Input,
  Layout,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {getSourceImage} from 'app/utils';
import {Loading, Error} from 'app/modules/common';
import {useProductDetail} from 'app/hooks';
import {NavigationStackProp} from 'react-navigation-stack';
import {NavigationRoute} from '@react-navigation';
import {useRoute} from '@react-navigation/core';

interface Props {
  navigation: NavigationStackProp<{productId: string}>;
}
export const ProductDetail: React.FC<Props> = ({
  navigation,
}): React.ReactElement => {
  const {params} = useRoute<any>();
  const productId = params?.productId as number;
  console.log('productIdproductIdproductId', productId);

  const [comment, setComment] = React.useState<string>();
  //const [selectedColorIndex, setSelectedColorIndex] = React.useState<number>();
  const styles = useStyleSheet(themedStyles);

  const {data, isLoading, error} = useProductDetail({productId});

  const product = data?.product;
  const onBuyButtonPress = (): void => {
    navigation && navigation.navigate('Payment');
  };

  const onAddButtonPress = (): void => {
    navigation && navigation.navigate('ShoppingCart');
  };

  const renderColorItem = (
    color: ProductColor,
    index: number,
  ): React.ReactElement => (
    <Radio key={index} style={styles.colorRadio}>
      {evaProps => (
        <Text {...evaProps} style={{color: color.value, marginLeft: 10}}>
          {color.description.toUpperCase()}
        </Text>
      )}
    </Radio>
  );

  const renderHeader = (): React.ReactElement => (
    <Layout style={styles.header}>
      <ImageBackground
        style={styles.image}
        source={getSourceImage(product?.image?.sourceUrl as string)}
      />
      <Layout style={styles.detailsContainer} level="1">
        <Text category="h6">{product?.name || ''}</Text>
        <Text style={styles.subtitle} appearance="hint" category="p2">
          {product?.shortDescription | ''}
        </Text>
        <Text style={styles.price} category="h4">
          {product.price}
        </Text>
        <Text style={styles.description} appearance="hint">
          {product?.description || ''}
        </Text>
        <Text style={styles.sectionLabel} category="h6">
          Size:
        </Text>
        <Text style={styles.size} appearance="hint">
          {/* {product.size} */} size
        </Text>
        <Text style={styles.sectionLabel} category="h6">
          Color:
        </Text>
        {/* <RadioGroup
          style={styles.colorGroup}
          selectedIndex={selectedColorIndex}
          onChange={setSelectedColorIndex}>
          {product.colors.map(renderColorItem)}
        </RadioGroup> */}
        <View style={styles.actionContainer}>
          <Button
            style={styles.actionButton}
            size="giant"
            onPress={onBuyButtonPress}>
            BUY
          </Button>
          <Button
            style={styles.actionButton}
            size="giant"
            status="control"
            onPress={onAddButtonPress}>
            ADD TO BAG
          </Button>
        </View>
      </Layout>
      <Input
        style={styles.commentInput}
        label={evaProps => (
          <Text {...evaProps} style={styles.commentInputLabel}>
            Comments
          </Text>
        )}
        placeholder="Write your comment"
        value={comment}
        onChangeText={setComment}
      />
    </Layout>
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return renderHeader();
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  subtitle: {
    marginTop: 4,
  },
  price: {
    position: 'absolute',
    top: 24,
    right: 16,
  },
  description: {
    marginVertical: 16,
  },
  size: {
    marginBottom: 16,
  },
  colorGroup: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  colorRadio: {
    marginHorizontal: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionLabel: {
    marginVertical: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
});
