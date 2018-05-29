// @flow
/* Replacement page on error happens on production */
import React from 'react'
import ViewError from '../viewError'
import ErrorBoundary from './ErrorBoundary'
import SettingsFallback from './SettingsFallback'

const BlueScreen = () => {
  return (
    <ViewError
      heading={'Something went wrong'}
      subheading={
        'Sorry about the issue. Bran has been notified of the problem and should resolve it soon.'
      }
      refresh
    />
  )
}

export { ErrorBoundary, SettingsFallback }
export default BlueScreen
