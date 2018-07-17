// @flow
/* Replacement page on error happens on production */
import React from 'react'
import ViewError from '../viewError'
import ErrorBoundary from './ErrorBoundary'
import SettingsFallback from './SettingsFallback'

const BlueScreen = () => {
  return (
    <ViewError
      heading={'啊哦，出错了'}
      subheading={
        '实在非常抱歉. 云社开发人员已经接收到错误信息并正在全力修复中.'
      }
      refresh
    />
  )
}

export { ErrorBoundary, SettingsFallback }
export default BlueScreen
