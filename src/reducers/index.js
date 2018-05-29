import { combineReducers } from 'redux'
import users from './users'
import type { Reducer } from 'redux'

const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    users,
    ...extraReducers
  })
}

export default getReducers
