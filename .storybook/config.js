import { configure } from '@storybook/react'

function importAll(req) {
  req.keys().forEach(filename => req(filename));
}

function loadStories() {
  let req;

  // Graphql
  req = require.context('../stories/graphql', true, /\.stories\.js$/);
  importAll(req);

  // Compoents
  req = require.context('../stories/components', true, /\.stories\.js$/);
  importAll(req);
}

configure(loadStories, module)