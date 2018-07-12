// @flow
import React from 'react'
import { withRouter } from 'react-router'
import compose from 'recompose/compose'
import Icon from '../../components/icons'
import FullscreenView from '../../components/fullscreenView'
import LoginButtonSet from '../../components/loginButtonSet'
import {
  LargeTitle,
  LargeSubtitle,
  UpsellIconContainer,
  FullscreenContent
} from './style'

type Props = {
  redirectPath: ?string,
  signinType?: ?string,
  close?: Function,
  location?: Object
}

export class Login extends React.Component<Props> {
  render () {
    const { redirectPath, signinType = 'signin' } = this.props
    const viewTitle = signinType === 'login' ? '欢迎回来!' : '选择一个你喜欢的登陆方式'
    const viewSubtitle =
      signinType === 'login'
        ? "很高心见到你回来 - 登陆一下查看你所关心的内容吧!"
        : '这是一个你可以自由分享你的想法，故事的地方，你在这里将发现很多有趣的故事。登陆一下开始你的旅程吧！'

    return (
      <FullscreenView
        noCloseButton={!this.props.close}
        close={this.props.close && this.props.close}
      >
        <FullscreenContent
          data-cy='login-page'
          style={{ justifyContent: 'center' }}
        >
          <UpsellIconContainer>
            <Icon glyph={'emoji'} size={64} />
          </UpsellIconContainer>
          <LargeTitle>{viewTitle}</LargeTitle>
          <LargeSubtitle>{viewSubtitle}</LargeSubtitle>

          <LoginButtonSet redirectPath={redirectPath} signinType={signinType} />
        </FullscreenContent>
      </FullscreenView>
    )
  }
}

export default compose(withRouter)(Login)
