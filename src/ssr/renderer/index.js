// @flow
// Server-side renderer for our React code
const debug = require('debug')('service-ssr:renderer');
import React from 'react';
// $FlowIssue
import { renderToNodeStream } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import Raven from '../raven';
import introspectionQueryResultData from '../../graphql/schema.json';
import stats from '../../../build/react-loadable.json';

import getSharedApolloClientOptions from '../../graphql/apolloClientOptions';
import { getFooter, getHeader } from './htmlTemplate';
import createCacheStream from '../createCacheStream';

// Browser shim has to come before any client imports
import './browserShim';
import Routes from '../../routes'
import { initStore } from '../../store'

const FORCE_DEV = process.env.FORCE_DEV;

const apiUrl = process.env.REACT_APP_API_URI || 'http://localhost:3000/api'

debug(`Querying API at ${apiUrl}`);

const renderer = (req: express$Request, res: express$Response) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  debug(`server-side render ${req.url}`);
  debug(`querying API at ${apiUrl}`);
  // HTTP Link for queries and mutations including file uploads
  const httpLink = createHttpLink({
    uri: apiUrl,
    credentials: 'include',
    headers: {
      cookie: req.headers.cookie,
    },
  });

  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    ...getSharedApolloClientOptions(),
  });

  // Create an Apollo Client with a local network interface
  const client = new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache,
  });
  // Define the initial redux state
  const { t } = req.query;

  const initialReduxState = {
    users: {
      // $FlowFixMe
      currentUser: req.user ? req.user : null,
    },
    dashboardFeed: {
      activeThread: t ? t : '',
      mountedWithActiveThread: t ? t : '',
      search: {
        isOpen: false,
      },
    },
  };
  // Create the Redux store
  const store = initStore(initialReduxState);
  let modules = [];
  const report = moduleName => {
    modules.push(moduleName);
  };
  let routerContext = {};
  let helmetContext = {};
  // Initialise the styled-components stylesheet and wrap the app with it
  const sheet = new ServerStyleSheet();
  const frontend = sheet.collectStyles(
    <Loadable.Capture report={report}>
      <ApolloProvider client={client}>
        <HelmetProvider context={helmetContext}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={routerContext}>
              {/* $FlowIssue */}
              <Routes currentUser={req.user} />
            </StaticRouter>
          </Provider>
        </HelmetProvider>
      </ApolloProvider>
    </Loadable.Capture>
  );

  debug('get data from tree');
  // $FlowFixMe
  getDataFromTree(frontend)
    .then(() => {
      debug('got data from tree');
      if (routerContext.url) {
        debug('found redirect on frontend, redirecting');
        // Somewhere a `<Redirect>` was rendered, so let's redirect server-side
        res.redirect(301, routerContext.url);
        return;
      }

      res.status(200);

      const state = store.getState();
      const data = client.extract();
      const { helmet } = helmetContext;
      debug('write header');
      let response = res;
      // $FlowFixMe
      if (!req.user) {
        response = createCacheStream(req.path);
        response.pipe(res);
      }

      response.write(
        getHeader({
          metaTags:
            helmet.title.toString() +
            helmet.meta.toString() +
            helmet.link.toString(),
        })
      );

      const stream = sheet.interleaveWithNodeStream(
        renderToNodeStream(frontend)
      );

      stream.pipe(response, { end: false });

      const bundles = getBundles(stats, modules)
        // Create <script defer> tags from bundle objects
        .map(bundle => `/${bundle.file.replace(/\.map$/, '')}`)
        // Make sure only unique bundles are included
        .filter((value, index, self) => self.indexOf(value) === index);
      debug('bundles used:', bundles.join(','));
      stream.on('end', () =>
        response.end(
          getFooter({
            state,
            data,
            bundles,
          })
        )
      );
    })
    .catch(err => {
      console.error(err);
      const sentryId =
        process.env.NODE_ENV === 'production'
          ? Raven.captureException(err)
          : 'Only output in production.';
      res.status(500);
      res.send(
        `Oops, something went wrong. Please try again! (Error ID: ${sentryId})`
      );
    });
};

export default renderer;
