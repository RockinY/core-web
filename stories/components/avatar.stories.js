import React from 'react'
import { storiesOf } from '@storybook/react'
import { Router } from 'react-router'
import { history } from '../../src/utils/history'
import AppViewWrapper from '../../src/components/appViewWrapper'

storiesOf('AppViewWrapper', module)
  .add('Default', () => (
    <Router history={history}>
      <AppViewWrapper>
        <div>Test</div>
      </AppViewWrapper>
    </Router>
  ))