// @flow
import * as React from 'react'
import type { ButtonProps } from './'
import { WechatButton, Label, A } from './style'
import Icon from '../icons'

export const WechatSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props

  return (
    <A onClick={() => onClickHandler && onClickHandler('wechat')} href={href}>
      <WechatButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'wechat'} />
        <Label>使用微信登陆</Label>
      </WechatButton>
    </A>
  )
}