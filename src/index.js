// @flow
import 'dotenv/config'
import 'css.escape'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import webPushManager from './utils/webPushManager'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import queryString from 'query-string'
import Loadable from 'react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { history } from './utils/history'
import { client, wsLink } from './graphql'
import { initStore } from './store'
import { getItemFromStorage } from './utils/localStorage'
import Routes from './routes'

const storedData: ?Object = getItemFromStorage('xlab');
const params = queryString.parse(history.location.search);

// Always redirect ?thread=asdfxyz to the thread view
if (params.thread) history.replace(`/thread/${params.thread}`);

// Redirect ?t=asdfxyz to the thread view only for anonymous users who wouldn't see it
// in their inbox view (since they don't have an inbox view)
if ((!storedData || !storedData.currentUser) && params.t)
  history.replace(`/thread/${params.t}`);

// If the server passes an initial redux state use that, otherwise construct our own
const store = initStore(
  window.__SERVER_STATE__ || {
    users: {
      currentUser: storedData ? storedData.currentUser : null,
    },
    dashboardFeed: {
      activeThread: params.t || '',
      mountedWithActiveThread: params.t || '',
      search: {
        isOpen: false,
      },
    },
  }
);

const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ApolloProvider client={client}>
          {/* $FlowFixMe */}
          <Router history={history}>
            <Routes currentUser={storedData ? storedData.currentUser : null} />
          </Router>
        </ApolloProvider>
      </HelmetProvider>
    </Provider>
  );
};

const renderMethod = !!window.__SERVER_STATE__
  ? // $FlowIssue
    ReactDOM.hydrate
  : ReactDOM.render;

function render() {
  return renderMethod(
    <App />,
    // $FlowIssue
    document.querySelector('#root')
  );
}

Loadable.preloadReady()
  .then(render)
  .catch(err => {
    console.error(err);
  });

OfflinePluginRuntime.install({
  // Apply new updates immediately
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  // Set a global variable when an update was installed so that we can reload the page when users
  // go to a new page, leading to no interruption in the workflow.
  // Idea from https://zach.codes/handling-client-side-app-updates-with-service-workers/
  onUpdated: () => (window.appUpdateAvailable = true),
});

if ('serviceWorker' in navigator && 'PushManager' in window) {
  // $FlowIssue
  navigator.serviceWorker.ready.then(registration => {
    webPushManager.set(registration.pushManager);
  });
}

wsLink.subscriptionClient.on('disconnected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'disconnected' })
);
wsLink.subscriptionClient.on('connected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'connected' })
);
wsLink.subscriptionClient.on('reconnected', () =>
  store.dispatch({ type: 'WEBSOCKET_CONNECTION', value: 'reconnected' })
);