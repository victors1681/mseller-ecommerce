import React from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import {useProduct} from 'app/hooks';
import {Product} from 'app/generated/graphql';
import {useNavigation} from '@react-navigation/core';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export const AutoComplete = () => {
  const [value, setValue] = React.useState<string | undefined>();
  const autoRef = React.useRef<Autocomplete | null>(null);

  const {
    handleSearch,
    product: {data, isLoading},
  } = useProduct();
  const navigation = useNavigation();

  const onSelect = (index: number) => {
    const productSelected =
      data?.products?.nodes && (data?.products?.nodes[index] as Product);
    if (productSelected) {
      //Update searchBar
      setValue(productSelected?.name as string);
      //Update search
      handleSearch(productSelected?.name as string);

      setTimeout(() => {
        //hide autocomplete
        autoRef?.current?.hide();
        //take the user to products screen with the filter
        navigation.navigate('Products');
      }, 500);
    }
  };
  const SearchIcon = (props: any) => <Icon {...props} name="search" />;
  const LoadingState = () => <Spinner size="tiny" />;
  const clearInput = () => {
    setValue('');
    handleSearch('');
  };

  const renderCloseIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={clearInput}>
      <Icon {...props} name="close" />
    </TouchableWithoutFeedback>
  );
  const onChangeText = (query: string) => {
    setValue(query);
    handleSearch(query);
  };

  const getProductList = () => {
    return data?.products.nodes?.map(product => {
      return <AutocompleteItem key={product?.id} title={product?.name || ''} />;
    });
  };

  return (
    <Autocomplete
      ref={autoRef}
      placeholder="Encuentra tu producto"
      value={value}
      onSelect={onSelect}
      accessoryRight={
        isLoading ? LoadingState : value ? renderCloseIcon : SearchIcon
      }
      onChangeText={onChangeText}>
      {getProductList()}
    </Autocomplete>
  );
};

export default AutoComplete;
