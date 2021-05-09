import React from 'react';
import {useProductStore, ProductStore} from '../store/useProductStore';

export const ProductContext = React.createContext({} as ProductStore);

ProductContext.displayName = 'Product Context';
export const ProductProvider: React.FC = ({children}) => {
  const values = useProductStore();
  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
};
