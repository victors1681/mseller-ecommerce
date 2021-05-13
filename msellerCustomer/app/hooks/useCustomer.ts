import React from 'react';
import {CustomerContext} from 'app/modules/customer/context/CustomerContext';
import {CustomerStore} from 'app/modules/customer/store/useCustomerStore';

/**
 * For easy access to Product from any part of the app
 * @returns
 */
export const useCustomer = (): CustomerStore => {
  const value = React.useContext(CustomerContext);
  return value;
};
