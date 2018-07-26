import React from 'react'
import { storiesOf } from '@storybook/react'
import Avatar from '../../src/components/avatar'
import centered from '@storybook/addon-centered'

storiesOf('Components|Avatar', module)
  .addDecorator(centered)
  .add('Default', () => (
    <div>Test</div>
  ))