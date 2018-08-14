// @flow
import * as React from 'react'
import { getItemFromStorage, storeItem } from '../../utils/localStorage'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { SERVER_URL, CLIENT_URL } from '../../constants'
import { Container } from './style'
import { GithubSigninButton } from './github'
import { AlipaySigninButton } from './alipay'
import { WechatSigninButton } from './wechat'

type Props = {
  redirectPath: ?string,
  location: Object,
};

export type ButtonProps = {
  onClickHandler?: ?Function,
  href: string,
  preferred: boolean,
  showAfter: boolean,
};

class LoginButtonSet extends React.Component<Props> {
  saveLoginMethod = (type: string) => {
    return storeItem('preferred_signin_method', type)
  };

  render () {
    const { redirectPath, location } = this.props

    let r
    if (location) {
      const searchObj = queryString.parse(this.props.location.search)
      r = searchObj.r
    }

    const postAuthRedirectPath =
      redirectPath !== undefined || r !== undefined
        ? // $FlowFixMe
        `?r=${redirectPath || r}`
        : `?r=${CLIENT_URL}/home`

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method')

    let nonePreferred = false
    if (!preferredSigninMethod) {
      nonePreferred = true
    }

    return (
      <Container>
        <WechatSigninButton
          onClickHandler={this.saveLoginMethod}
          href={`${SERVER_URL}/auth/wechat${postAuthRedirectPath}`}
          preferred={nonePreferred ? true : preferredSigninMethod === 'wechat'}
          showAfter={preferredSigninMethod === 'wechat'}
        />
        <AlipaySigninButton
          onClickHandler={this.saveLoginMethod}
          href={`${SERVER_URL}/auth/alipay${postAuthRedirectPath}`}
          preferred={nonePreferred ? true : preferredSigninMethod === 'alipay'}
          showAfter={preferredSigninMethod === 'alipay'}
        />
        <GithubSigninButton
          onClickHandler={this.saveLoginMethod}
          href={`${SERVER_URL}/auth/github${postAuthRedirectPath}`}
          preferred={nonePreferred ? true : preferredSigninMethod === 'github'}
          showAfter={preferredSigninMethod === 'github'}
        />
      </Container>
    )
  }
}

export default withRouter(LoginButtonSet)
