// @flow
export const IS_PROD = process.env.NODE_ENV === 'production'
export const API_URI = IS_PROD ? 'http://47.98.198.16/api' : 'http://localhost:3000/api'
export const WS_URI = IS_PROD ? `wss://47.98.198.16/websocket` : 'ws://localhost:3000/websocket'
