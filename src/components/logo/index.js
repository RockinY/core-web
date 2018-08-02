// @flow
import React from 'react'
import styled from 'styled-components'

const Img = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: inherit;
  fill: currentColor;
`

const LogoWrapper = styled.div`
  display: inline-block;
  flex: none;
  width: 160px;
  height: 25px;
  top: 4px;
  position: relative;
  color: inherit;
`

const LogoCloudStyle = styled.img`
  width: ${props => props.size || '32px'};
  height: ${props => props.size || '32px'};
`

export const Logo = () => {
  return (
    <LogoWrapper>
      <Img src="/img/logo.png" />
    </LogoWrapper>
  )
}

export const GreenLogo = () => {
  return (
    <LogoWrapper>
      <Img src="/img/logo-green.png" />
    </LogoWrapper>
  )
}

export const LogoCloud = () => {
  return (
    <LogoCloudStyle src="/img/badge.png" />
  )
}
