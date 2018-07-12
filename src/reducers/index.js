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
import connectionStatus from './connectionStatus'
import threadSlider from './threadSlider'

const getReducers = () => {
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
    connectionStatus,
    threadSlider
  })
}

export default getReducers
