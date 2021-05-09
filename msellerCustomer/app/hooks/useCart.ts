import React from 'react';
import {CartContext} from 'app/modules/cart/context/CartContext';
import {CartStore} from 'app/modules/cart/store/useCartStore';

/**
 * For easy access to cart from any part of the app
 * @returns
 */
export const useCart = (): CartStore => {
  const value = React.useContext(CartContext);
  return value;
};
