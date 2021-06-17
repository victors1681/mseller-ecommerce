declare module '*.png' {
  const value: any;
  export = value;
}

declare module '@env' {
  export const DEV_GRAPHQL_URL: string;
  export const PROD_GRAPHQL_URL: string;
}
