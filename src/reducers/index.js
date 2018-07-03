import { combineReducers } from 'redux'
import users from './users'
import toasts from './toasts'
import newActivityIndicator from './newActivityIndicator'
import dashboardFeed from './dashboardFeed'
import modals from './modals'
import type { Reducer } from 'redux'

const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    users,
    modals,
    toasts,
    newActivityIndicator,
    dashboardFeed,
    ...extraReducers
  })
}

export default getReducers
