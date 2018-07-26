import React from 'react'
import { storiesOf } from '@storybook/react'
import Avatar from '../../src/components/avatar'
import centered from '@storybook/addon-centered'
import { ThemeProvider } from 'styled-components'
import theme from '../../src/theme'
import { AVATAR_URL } from '../samples'

storiesOf('Components|Avatar', module)
  .addDecorator(centered)
  .add('Default', () => (
    <ThemeProvider theme={theme}>
      <Avatar src={AVATAR_URL} />
    </ThemeProvider>
  ))