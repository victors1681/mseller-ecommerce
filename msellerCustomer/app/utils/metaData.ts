import {Maybe, MetaData} from 'app/generated/graphql';

/**
 * Get Value from metadata by key
 * @param meta metadata array
 * @param key key name
 * @returns MetaData object or undefined
 */
export const getMetaData = (meta: Maybe<Maybe<MetaData>[]>, key: string) =>
  meta && meta.find(f => f && f.key === key);

export const getMetadataFromJson = (
  meta: Maybe<Maybe<MetaData>[]> | undefined,
  key: string,
): object | undefined => {
  try {
    if (!meta) {
      return;
    }
    const md = getMetaData(meta, key);

    if (md && md.value) {
      return JSON.parse(md.value);
    }
  } catch (err) {
    console.error("Can't pase the metadata to json", err);
  }
};
