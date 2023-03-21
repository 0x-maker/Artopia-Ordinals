import { isBrowser } from './common';

export const isImageURL = (url: string): boolean => {
  return (
    url.match(
      /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp|bmp|ico|cur|tif|tiff)$/
    ) !== null
  );
};

export const getUrlWithQueryParams = (url: string): string => {
  if (isBrowser()) {
    const currentURL = new URL(location.href);
    if (currentURL.search) {
      return `${url}${currentURL.search}`;
    }
  }
  return url;
};
