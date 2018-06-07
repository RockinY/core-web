import { combineReducers } from 'redux'
import users from './users'
import toasts from './toasts'
import type { Reducer } from 'redux'

const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    users,
    toasts,
    ...extraReducers
  })
}

export default getReducers
