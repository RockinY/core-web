import { combineReducers } from 'redux'
import users from './users'
import toasts from './toasts'
import newActivityIndicator from './newActivityIndicator'
import type { Reducer } from 'redux'

const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    users,
    toasts,
    newActivityIndicator,
    ...extraReducers
  })
}

export default getReducers
