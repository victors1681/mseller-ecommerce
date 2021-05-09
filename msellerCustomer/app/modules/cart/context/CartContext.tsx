import React from 'react';
import {useCartStore, CartStore} from '../store/useCartStore';

export const CartContext = React.createContext({} as CartStore);

CartContext.displayName = 'Cart Context';
export const CartProvider: React.FC = ({children}) => {
  const values = useCartStore();
  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
