// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'

export const CLIENT_URL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:5000'

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000'
