import React from 'react';
import {Icon, Input} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {useProduct} from 'app/hooks';

const SearchIcon = props => <Icon {...props} name="search" />;

interface Props {
  categoryId?: number;
}

export const SearchBar: React.FC<Props> = ({categoryId}) => {
  const {handleSearch} = useProduct();

  const onSearch = React.useCallback(
    (value: string) => {
      handleSearch(value, categoryId);
    },
    [categoryId],
  );

  return (
    <Input
      style={styles.searchBar}
      placeholder="Buscar Producto"
      accessoryRight={SearchIcon}
      onChangeText={onSearch}
    />
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    padding: 8,
  },
  container: {
    backgroundColor: 'red',
  },
});
