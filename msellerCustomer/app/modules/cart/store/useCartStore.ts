import {
  ADD_TO_CART,
  REMOVE_ITEM,
  GET_CART,
  UPDATE_QUANTITY,
} from 'app/graphql/cart';
import {DrawerActions} from '@react-navigation/native';
import {navigationRef} from 'app/navigation/RootNavigation';
import {
  Cart,
  CartItemInput,
  RemoveItemsFromCartInput,
  UpdateItemQuantitiesInput,
  UpdateItemQuantitiesPayload,
  RemoveItemsFromCartPayload,
  AddToCartPayload,
  CartItemQuantityInput,
} from 'app/generated/graphql'; // Import
import {
  useMutation,
  useQuery,
  ApolloError,
  OperationVariables,
  ApolloQueryResult,
  MutationResult,
  FetchResult,
} from '@apollo/client';
import React from 'react';
interface Data {
  cart?: Cart;
}

interface UpdateQuantitiesResponse {
  updateItemQuantities: UpdateItemQuantitiesPayload;
}
interface RemoveItemsFromCartData {
  removeItemsFromCart: RemoveItemsFromCartPayload;
}
interface AddToCartData {
  addToCart: AddToCartPayload;
}
interface Args {
  input: CartItemInput;
}

interface RemoveItemsFromCartArgs {
  input: RemoveItemsFromCartInput;
}

interface UpdateQuantities {
  input: UpdateItemQuantitiesInput;
}

export interface CartStore {
  cart: Cart | undefined;
  isLoading: boolean;
  data: Data | undefined;
  error: ApolloError | undefined;
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<Data>>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  addItemInfo: MutationResult<AddToCartData>;
  removeItem: (key: string) => Promise<void>;
  removeItems: (key: string[]) => Promise<void>;
  removeItemInfo: MutationResult<RemoveItemsFromCartData>;
  updateItem: (
    key: string,
    quantity: number,
  ) => Promise<
    FetchResult<
      UpdateQuantitiesResponse,
      Record<string, any>,
      Record<string, any>
    >
  >;
  updateItems: (
    items: CartItemQuantityInput[],
  ) => Promise<
    FetchResult<
      UpdateQuantitiesResponse,
      Record<string, any>,
      Record<string, any>
    >
  >;
  updateItemInfo: MutationResult<UpdateQuantitiesResponse>;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useCartStore = (): CartStore => {
  const [cart, setCart] = React.useState<Cart | undefined>({} as Cart);

  const {loading: isLoading, data, error, refetch} = useQuery<Data>(GET_CART, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!isLoading) {
      setCart(data?.cart);
    }
  }, [isLoading, data]);

  const [addToCart, addItemInfo] = useMutation<AddToCartData, Args>(
    ADD_TO_CART,
  );
  const [removeItemFromCart, removeItemInfo] = useMutation<
    RemoveItemsFromCartData,
    RemoveItemsFromCartArgs
  >(REMOVE_ITEM);

  const [updateQuantity, updateItemInfo] = useMutation<
    UpdateQuantitiesResponse,
    UpdateQuantities
  >(UPDATE_QUANTITY);

  const navigation = navigationRef.current;

  const addItem = async (productId: number, quantity: number) => {
    const response = await addToCart({
      variables: {input: {productId, quantity}},
    });

    Promise.resolve()
      .then(() => setCart(response.data?.addToCart.cart as Cart))
      .then(() => navigation?.dispatch(DrawerActions.openDrawer()));
  };

  const removeItem = async (key: string): Promise<void> => {
    const response = await removeItemFromCart({
      variables: {input: {keys: [key]}},
    });
    setCart(response.data?.removeItemsFromCart.cart as Cart);
  };

  const removeItems = async (keys: string[]): Promise<void> => {
    const response = await removeItemFromCart({
      variables: {input: {keys: keys}},
    });
    setCart(response.data?.removeItemsFromCart.cart as Cart);
  };

  const updateItem = async (key: string, quantity: number) => {
    const response = await updateQuantity({
      variables: {input: {items: [{key, quantity}]}},
    });
    setCart(response.data?.updateItemQuantities?.cart as Cart);
    return response;
  };

  const updateItems = async (items: CartItemQuantityInput[]) => {
    const response = await updateQuantity({
      variables: {input: {items: items}},
    });
    setCart(response.data?.updateItemQuantities?.cart as Cart);
    return response;
  };

  return {
    cart,
    isLoading,
    data,
    error,
    refetch,
    addItem,
    addItemInfo,
    removeItem,
    removeItems,
    removeItemInfo,
    updateItem,
    updateItems,
    updateItemInfo,
  };
};
