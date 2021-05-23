import {SimpleProduct} from 'app/generated/graphql';

export function isSimpleProduct(node: any): node is SimpleProduct {
  return node.__typename === 'SimpleProduct';
}

export function isVariableProduct(node: any): node is SimpleProduct {
  return node.__typename === 'VariableProduct';
}
