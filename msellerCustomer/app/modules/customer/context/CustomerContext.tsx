import React from 'react';
import {useCustomerStore, CustomerStore} from '../store/useCustomerStore';

export const CustomerContext = React.createContext({} as CustomerStore);

CustomerContext.displayName = 'Customer Context';
export const CustomerProvider: React.FC = ({children}) => {
  const values = useCustomerStore();
  return (
    <CustomerContext.Provider value={values}>
      {children}
    </CustomerContext.Provider>
  );
};
