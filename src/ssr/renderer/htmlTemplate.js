// @flow
import fs from 'fs';
import path from 'path';
import { html } from 'common-tags';
import serialize from 'serialize-javascript';

// Match main.asdf123.js in production mode or bundle.js in dev mode
const mainBundleRegex = /(main|bundle)\.(?:.*\.)?js$/;

let bundles;
try {
  bundles = fs.readdirSync(path.join(__dirname, '../../../build/static/js'));
} catch (err) {
  throw new Error(
    'It looks like you didn\'t run "yarn run dev" or "yarn run build" before starting ssr server.'
  );
}

// Get the main bundle filename
const mainBundle = bundles.find(bundle => mainBundleRegex.test(bundle));
if (!mainBundle) {
  throw new Error(
    'It looks like you didn\'t run "yarn run dev" or "yarn run build" before starting ssr server.'
  );
}

// defer attribute here means that the script 
// is executed when the page has finished parsing
export const createScriptTag = ({ src }: { src: string }) => {
  return `<script defer="defer" src="${src}"></script>`;
}

export const getHeader = ({ metaTags }: { metaTags: string }) => {
  return html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link rel="mask-icon" href="/img/pinned-tab.svg" color="#171A21">
          <meta name="theme-color" content="#171A21">
          <link rel="manifest" href="/manifest.json">
          <meta name="og:type" content="website">
          <meta name="og:site_name" content="云社">
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/img/apple-icon-57x57-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/img/apple-icon-72x72-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/img/apple-icon-114x114-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/img/apple-icon-144x144-precomposed.png" />
          ${metaTags}
        </head>
        <body>
          <div id="root">`;
};

export const getFooter = ({
  state,
  data,
  bundles,
}: {
  state: Object,
  data: Object,
  bundles: Array<string>,
}) => {
  return html`</div>
      <script>window.__SERVER_STATE__=${serialize(state)}</script>
      <script>window.__DATA__=${serialize(data)}</script>
      <script defer="defer" type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.find,Symbol.iterator"></script>
      ${bundles.map(src => createScriptTag({ src }))}
    </body>
    </html>
  `;
};
