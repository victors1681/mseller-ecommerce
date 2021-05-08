import {useMutation, FetchResult} from '@apollo/client';
import React from 'react';
import {Cart, CartItemInput} from '../../generated/graphql'; // Import
import {ADD_TO_CART} from '../../graphql/cart';

interface Data {
  cart?: Cart;
}

interface Args {
  input: CartItemInput;
}

export const useCart = () => {
  const [add, {data, loading, error}] = useMutation<Data, Args>(ADD_TO_CART);

  React.useEffect(() => {
    console.log('DATA Added', data, error);
  }, [data]);

  const addToCart = () => {
    console.log('AADDING PRODUCT');
    add({variables: {input: {productId: 23, quantity: 1}}});
  };

  return {
    addToCart,
    data,
    loading,
    error,
  };
};
