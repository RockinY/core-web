// @flow
import 'dotenv/config'
import 'css.escape'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import queryString from 'query-string'
import Loadable from 'react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { history } from './helpers/history'
import { client } from './graphql'
import { initStore } from './store'
import { getItemFromStorage } from './helpers/localStorage'
import Routes from './routes'

const { thread, t } = queryString.parse(history.location.search)

const existingUser = getItemFromStorage('xlab')
let initialState
if (existingUser) {
  initialState = {
    users: {
      currentUser: existingUser.currentUser
    },
    dashboardFeed: {
      activeThread: t || '',
      mountedWithActiveThread: t || '',
      search: {
        isOpen: false
      }
    }
  }
} else {
  initialState = {}
}

if (thread) {
  const hash = window.location.hash.substr(1)
  if (hash && hash.length > 1) {
    history.replace(`/thread/${thread}#${hash}`)
  } else {
    history.replace(`/thread/${thread}`)
  }
}

if (t && (!existingUser || !existingUser.currentUser)) {
  const hash = window.location.hash.substr(1)
  if (hash && hash.length > 1) {
    history.replace(`/thread/${t}#${hash}`)
  } else {
    history.replace(`/thread/${t}`)
  }
}

const store = initStore(window.__SERVER_STATE__ || initialState)

/* Render */
const renderMethod = window.__SERVER_STATE__ ? ReactDOM.hydrate : ReactDOM.render

function render () {
  return renderMethod(
    <Provider store={store}>
      <HelmetProvider>
        <ApolloProvider client={client}>
          {/* $FlowFixMe */}
          <Router history={history}>
            <Routes
              maintenanceMode={
                process.env.REACT_APP_MAINTENANCE_MODE === 'enabled'
              }
            />
          </Router>
        </ApolloProvider>
      </HelmetProvider>
    </Provider>,
    // $FlowFixMe
    document.querySelector('#root')
  )
}

Loadable.preloadReady().then(render)
