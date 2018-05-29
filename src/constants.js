// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const CLIENT_URL = IS_PROD
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:5000'
