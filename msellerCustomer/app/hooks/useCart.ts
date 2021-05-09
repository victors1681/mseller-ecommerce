import React from 'react';
import {CartContext} from 'app/components/cart/context/CartContext';
import {CartStore} from 'app/components/cart/store/useCartStore';

/**
 * For easy access to cart from any part of the app
 * @returns
 */
export const useCart = (): CartStore => {
  const value = React.useContext(CartContext);
  return value;
};
