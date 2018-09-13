import React from 'react'
import Loadable from 'react-loadable';
import { Loading } from '../loading';
/* styles */
import './styles/global'
import './styles/prism'
import 'draft-js/dist/Draft.css'

const RichTextEditor = Loadable({
  loader: () => import('./components/Editor'),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

export default RichTextEditor;