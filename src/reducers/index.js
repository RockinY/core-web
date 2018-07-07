import { combineReducers } from 'redux'
import users from './users'
import toasts from './toasts'
import newActivityIndicator from './newActivityIndicator'
import dashboardFeed from './dashboardFeed'
import newUserOnboarding from './newUserOnboarding'
import directMessageThreads from './directMessageThreads'
import message from './message'
import modals from './modals'
import gallery from './gallery';
import composer from './composer';
import notifications from './notifications'
import type { Reducer } from 'redux'

const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    composer,
    users,
    modals,
    toasts,
    gallery,
    newActivityIndicator,
    newUserOnboarding,
    dashboardFeed,
    directMessageThreads,
    message,
    notifications,
    ...extraReducers
  })
}

export default getReducers
