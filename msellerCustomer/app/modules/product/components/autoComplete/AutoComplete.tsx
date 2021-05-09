import React from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import {useProduct} from 'app/hooks';
import {Product} from 'app/generated/graphql';

export const AutoComplete = () => {
  const [value, setValue] = React.useState<string | undefined>();
  const {
    handleSearch,
    product: {data, isLoading},
  } = useProduct();

  const onSelect = (index: number) => {
    const productSelected =
      data?.products?.nodes && (data?.products?.nodes[index] as Product);
    if (productSelected) {
    }
    setValue(productSelected?.name as string);
  };
  const SearchIcon = (props: any) => <Icon {...props} name="search" />;
  const LoadingState = () => <Spinner size="tiny" />;
  const onChangeText = (query: string) => {
    console.log('queyr', query);
    handleSearch(query);
  };
  React.useEffect(() => {
    console.log('datadata', data);
  }, [data]);

  const getProductList = () => {
    return data?.products.nodes?.map(product => {
      return <AutocompleteItem key={product?.id} title={product?.name || ''} />;
    });
  };

  return (
    <Autocomplete
      placeholder="Encuentra tu producto"
      value={value}
      onSelect={onSelect}
      accessoryRight={isLoading ? LoadingState : SearchIcon}
      onChangeText={onChangeText}>
      {getProductList()}
    </Autocomplete>
  );
};

export default AutoComplete;
