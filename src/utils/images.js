// @flow
type imageStyle = 'thumbnail' | 'medium' | 'big'

/**
 * Optimize an image using build-in ali-oss processes
 */
export const optimize = (src: string, style: imageStyle): string => {
  return `${src}?x-oss-process=style/${style}`
};

export const FREE_USER_MAX_IMAGE_SIZE_BYTES = 3000000;
export const PRO_USER_MAX_IMAGE_SIZE_BYTES = 25000000;
export const FREE_USER_MAX_IMAGE_SIZE_STRING = `${Math.floor(
  FREE_USER_MAX_IMAGE_SIZE_BYTES / 1000000
)}mb`;
export const PRO_USER_MAX_IMAGE_SIZE_STRING = `${Math.floor(
  PRO_USER_MAX_IMAGE_SIZE_BYTES / 1000000
)}mb`;