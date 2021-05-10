export const getSourceImage = (image?: string) => {
  if (!image) {
    return require('app/assets/images/image-placeholder.jpeg');
  }
  return {
    uri: image,
  };
};
