import {Maybe} from 'app/generated/graphql';

export const expirationCardFormat = (expiration: Maybe<string> | undefined) => {
  if (expiration && expiration.length === 6) {
    const year = expiration.slice(0, 4);
    const month = expiration.slice(4, 6);
    return `${month}/${year}`;
  }
  return expiration;
};
