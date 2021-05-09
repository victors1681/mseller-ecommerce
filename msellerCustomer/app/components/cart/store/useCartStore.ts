import {ADD_TO_CART, REMOVE_ITEM, GET_CART} from 'app/graphql/cart';
import {DrawerActions} from '@react-navigation/native';
import {navigationRef} from 'app/navigation/RootNavigation';
import {
  Cart,
  CartItemInput,
  RemoveItemsFromCartInput,
} from 'app/generated/graphql'; // Import
import {
  useMutation,
  useQuery,
  ApolloError,
  OperationVariables,
  ApolloQueryResult,
  MutationResult,
} from '@apollo/client';
interface Data {
  cart?: Cart;
}

interface Args {
  input: CartItemInput;
}

interface RemoveItemsFromCartArgs {
  input: RemoveItemsFromCartInput;
}

export interface CartStore {
  isLoading: boolean;
  data: Data | undefined;
  error: ApolloError | undefined;
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<Data>>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  addItemInfo: MutationResult<Data>;
  removeItem: (key: string) => Promise<void>;
  removeItemInfo: MutationResult<Data>;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useCartStore = (): CartStore => {
  const {loading: isLoading, data, error, refetch} = useQuery<Data>(GET_CART, {
    fetchPolicy: 'network-only',
  });

  const [addToCart, addItemInfo] = useMutation<Data, Args>(ADD_TO_CART);
  const [removeItemFromCart, removeItemInfo] = useMutation<
    Data,
    RemoveItemsFromCartArgs
  >(REMOVE_ITEM);

  const navigation = navigationRef.current;

  const addItem = async (productId: number, quantity: number) => {
    await addToCart({variables: {input: {productId, quantity}}});

    navigation?.dispatch(DrawerActions.openDrawer());
  };

  const removeItem = async (key: string): Promise<void> => {
    await removeItemFromCart({variables: {input: {keys: [key]}}});
    refetch();
  };

  return {
    isLoading,
    data,
    error,
    refetch,
    addItem,
    addItemInfo,
    removeItem,
    removeItemInfo,
  };
};
