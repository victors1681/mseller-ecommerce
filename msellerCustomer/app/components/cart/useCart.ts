import {useMutation} from '@apollo/client';
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

  const addToCart = (productId: number, quantity: number) => {
    add({variables: {input: {productId, quantity}}});
  };

  return {
    addToCart,
    data,
    loading,
    error,
  };
};
