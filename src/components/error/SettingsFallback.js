// @flow
import * as React from 'react'
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter
} from '../settingsViews/style'
import { Button } from '../buttons'

class SettingsFallback extends React.Component<{}> {
  render () {
    return (
      <SectionCard>
        <SectionTitle>
          <span
            role='img'
            aria-label='sad emoji'
            style={{ marginRight: '8px' }}
          >
            😔
          </span>{' '}
          啊哦，出错了
        </SectionTitle>
        <SectionSubtitle>
          加载信息失败. 云社开发人员已经接收到错误信息并正在全力修复中.
        </SectionSubtitle>

        <SectionCardFooter>
          <Button
            large={false}
            icon='view-reload'
            onClick={() => window.location.reload(true)}
          >
            Refresh the page
          </Button>
        </SectionCardFooter>
      </SectionCard>
    )
  }
}

export default SettingsFallback
