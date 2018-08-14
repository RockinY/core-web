// @flow
import * as React from 'react'
import type { ButtonProps } from './'
import { AlipayButton, Label, A } from './style'
import Icon from '../icons'

export const AlipaySigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props

  return (
    <A onClick={() => onClickHandler && onClickHandler('alipay')} href={href}>
      <AlipayButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'alipay'} />
        <Label>使用支付宝登陆</Label>
      </AlipayButton>
    </A>
  )
}