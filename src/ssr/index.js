// @flow
import 'dotenv/config'
import 'raf/polyfill';
import 'isomorphic-fetch'; // prevent https://github.com/withspectrum/spectrum/issues/3032
import fs from 'fs';
import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';
import { getUser } from './model';
import Raven from './raven';
import toobusy from './middlewares/toobusy';
import addSecurityMiddleware from './middlewares/security';
import logging from './middlewares/logging'
import session from './middlewares/session'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import threadParamRedirect from './middlewares/threadParam'

const debug = require('debug')('service-ssr');
debug('Service ssr starting...');
debug('logging with debug enabled');

const PORT = process.env.SSR_PORT || 3006;
const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000'

/* ----------- API server ----------- */
const app = express()
app.set('trust proxy', true)

/* ----------- Middlewares ----------- */
// *. Toobusy situation
app.use(toobusy)
// *. Increase security
addSecurityMiddleware(app)
// *. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(logging)
}
// *. Cross Origin Request
app.use(cors({
  origin: ['http://localhost:5000', 'https://www.liangboyuan.pub'],
  credentials: true
}))

// Redirect requests to /api, /auth and /websocket to the server API
app.use(['/api', '/auth', '/websocket'], (req: express$Request, res: express$Response) => {
  const redirectUrl = `${req.baseUrl}${req.path}`;
  res.redirect(
    req.method === 'POST' || req.xhr ? 307 : 301,
    `${serverUrl}${redirectUrl}`
  );
})

// *. Cookie parser
app.use(cookieParser())
// *. JSON body parser
app.use(bodyParser.json())
// *. Session
app.use(session)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getUser({ id })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});
app.use(passport.initialize());
app.use(passport.session());

// This needs to come after passport otherwise we'll always redirect logged-in users
app.use(threadParamRedirect);

// Static files
// This route handles the case where our ServiceWorker requests main.asdf123.js, but
// we've deployed a new version of the app so the filename changed to main.dfyt975.js
let jsFiles;
try {
  jsFiles = fs.readdirSync(
    path.resolve(__dirname, '../..', 'build', 'static', 'js')
  );
} catch (err) {
  // In development that folder might not exist, so ignore errors here
  console.error(err);
}
app.use(
  express.static(path.resolve(__dirname, '../..', 'build'), {
    index: false,
    setHeaders: (res, path) => {
      // Don't cache the serviceworker in the browser
      if (path.indexOf('sw.js')) {
        res.setHeader('Cache-Control', 'no-store');
        return;
      }
    },
  })
);
app.get('/static/js/:name', (req: express$Request, res, next) => {
  if (!req.params.name) return next();
  const existingFile = jsFiles.find(file => file.startsWith(req.params.name));
  if (existingFile)
    return res.sendFile(
      path.resolve(__dirname, '../..', 'build', 'static', 'js', req.params.name)
    );
  const match = req.params.name.match(/(\w+?)\.(\w+?\.)?js/i);
  if (!match) return next();
  const actualFilename = jsFiles.find(file => file.startsWith(match[1]));
  if (!actualFilename) return next();
  res.redirect(`/static/js/${actualFilename}`);
});

// In dev the static files from the root public folder aren't moved to the build folder by create-react-app
// so we just tell Express to serve those too
if (process.env.NODE_ENV === 'development') {
  app.use(
    express.static(path.resolve(__dirname, '../..', 'public'), { index: false })
  );
}

app.get('*', (req: express$Request, res, next) => {
  // Electron requests should only be client-side rendered
  if (
    req.headers['user-agent'] &&
    req.headers['user-agent'].indexOf('Electron') > -1
  ) {
    return res.sendFile(path.resolve(__dirname, '../../build/index.html'));
  }
  next();
});

import cache from './cache';
app.use(cache);

import renderer from './renderer';
app.get('*', renderer);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    await new Promise(res => Raven.captureException(err, res));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

Loadable.preloadAll().then(() => {
  app.listen(PORT);
  debug(
    `Server-side renderer, running at http://localhost:${PORT}`
  );
});
