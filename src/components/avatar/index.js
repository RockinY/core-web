// @flow
import React, { Component } from 'react'
import { Manager, Reference } from 'react-popper'
import AvatarImage from './image'
import { Status, AvatarLink, AvatarNoLink } from './style'

const LinkHandler = props => {
  if (props.link && !props.noLink) {
    return <AvatarLink to={props.link}>{props.children}</AvatarLink>
  } else {
    return <AvatarNoLink>{props.children}</AvatarNoLink>
  }
}

type AvatarProps = {
  src: string,
  community?: any,
  user?: any,
  size?: string,
  mobileSize?: string,
  link?: ?string,
  noLink?: boolean,
  showProfile?: boolean
}

export default class Avatar extends Component<AvatarProps, State> {
  render () {
    const {
      src,
      community,
      user,
      size = '32',
      mobileSize
    } = this.props

    // TODO: add actual optimize method
    const optimizedAvatar = src
    const communityFallback = '/img/default_community.svg'
    const userFallback = '/img/default_avatar.svg'

    let source

    if (community && !user) {
      source = [optimizedAvatar, communityFallback]
    } else {
      source = [optimizedAvatar, userFallback]
    }

    return (
      <Status
        size={size}
        mobileSize={mobileSize}
        {...this.props}
      >
        <Manager>
          <LinkHandler {...this.props}>
            <Reference>
              {({ ref }) => (
                <AvatarImage
                  src={source}
                  size={size}
                  mobileSize={mobileSize}
                  community={community}
                  innerRef={ref}
                />
              )}
            </Reference>
          </LinkHandler>
        </Manager>
      </Status>
    )
  }
}
