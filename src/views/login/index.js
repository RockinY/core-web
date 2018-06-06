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
    const viewTitle = signinType === 'login' ? 'Welcome back!' : 'Sign in to get started'
    const viewSubtitle =
      signinType === 'login'
        ? "We're happy to see you again - sign in below to get back into the conversation!"
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.'

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
