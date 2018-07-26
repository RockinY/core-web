// @flow
import React, { Component } from 'react';
import { optimize } from '../../utils/images';
import { CommunityHoverProfile } from '../hoverProfile';
import type { CommunityInfoType } from '../../graphql/fragments/community/communityInfo';
import AvatarImage from './image';
import { Status, AvatarLink } from './style';
import ConditionalWrap from '../conditionalWrap';

type Props = {
  community: CommunityInfoType,
  size?: number,
  mobilesize?: number,
  style?: Object,
  showHoverProfile?: boolean,
  clickable?: boolean,
};

export default class AvatarHandler extends Component<Props> {
  render() {
    const { showHoverProfile = true, community } = this.props;

    return (
      <ConditionalWrap
        condition={showHoverProfile}
        wrap={children => (
          // $FlowFixMe
          <CommunityHoverProfile id={community.id}>
            {children}
          </CommunityHoverProfile>
        )}
      >
        <Avatar {...this.props} />
      </ConditionalWrap>
    );
  }
}

class Avatar extends React.Component<Props> {
  render() {
    const {
      community,
      size = 32,
      clickable = true,
      mobilesize,
      style,
    } = this.props;

    const src = community.profilePhoto;

    const optimizedAvatar =
      src &&
      optimize(src, 'medium');
    const communityFallback = '/img/default_community.svg';
    const source = [optimizedAvatar, communityFallback];

    return (
      <Status
        size={size}
        mobilesize={mobilesize}
        style={style}
        type={'community'}
      >
        <ConditionalWrap
          condition={clickable}
          wrap={children => (
            <AvatarLink to={`/${community.slug}`}>{children}</AvatarLink>
          )}
        >
          <AvatarImage
            src={source}
            size={size}
            mobilesize={mobilesize}
            type={'community'}
          />
        </ConditionalWrap>
      </Status>
    );
  }
}
