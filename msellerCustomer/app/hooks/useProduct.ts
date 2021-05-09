import React from 'react';
import {ProductContext} from 'app/modules/product/context/ProductContext';
import {ProductStore} from 'app/modules/product/store/useProductStore';

/**
 * For easy access to Product from any part of the app
 * @returns
 */
export const useProduct = (): ProductStore => {
  const value = React.useContext(ProductContext);
  return value;
};
