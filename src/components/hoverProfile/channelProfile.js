// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AvatarImage from '../avatar/image';
import Link from '../link';
import { Button, OutlineButton } from '../buttons';
import ToggleChannelMembership from '../toggleChannelMembership';
import renderTextWithLinks from '../../utils/renderTextWithMarkdownLinks';
import type { GetChannelType } from '../../graphql/queries/channel/getChannel';
import type { Dispatch } from 'redux';
import {
  HoverWrapper,
  ProfileCard,
  ChannelCommunityRow,
  ChannelCommunityLabel,
  Content,
  Title,
  Description,
  Actions,
} from './style';

type ProfileProps = {
  channel: GetChannelType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  render() {
    const { channel, innerRef, style } = this.props;

    const {
      isOwner: isChannelOwner,
      isMember: isChannelMember,
    } = channel.channelPermissions;
    const { communityPermissions } = channel.community;
    const {
      isOwner: isCommunityOwner,
      isModerator: isCommunityModerator,
    } = communityPermissions;
    const isGlobalOwner = isChannelOwner || isCommunityOwner;
    const isGlobalModerator = isCommunityModerator;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <ProfileCard>
          <ChannelCommunityRow to={`/${channel.community.slug}`}>
            <AvatarImage
              size={24}
              src={channel.community.profilePhoto}
              type={'community'}
            />
            <ChannelCommunityLabel>
              {channel.community.name}
            </ChannelCommunityLabel>
          </ChannelCommunityRow>

          <Content>
            <Link to={`/${channel.community.slug}/${channel.slug}`}>
              <Title>{channel.name}</Title>
            </Link>
            {channel.description && (
              <Description>
                {renderTextWithLinks(channel.description)}
              </Description>
            )}
          </Content>

          <Actions>
            {!isGlobalModerator &&
              !isGlobalOwner && (
                <ToggleChannelMembership
                  channel={channel}
                  render={state => {
                    if (isChannelMember) {
                      return (
                        <OutlineButton
                          isMember={true}
                          icon={'checkmark'}
                          loading={state.isLoading}
                        >
                          已经加入
                        </OutlineButton>
                      );
                    } else {
                      return (
                        <Button
                          isMember={false}
                          icon={'plus-fill'}
                          loading={state.isLoading}
                          gradientTheme={'success'}
                        >
                          加入频道
                        </Button>
                      );
                    }
                  }}
                />
              )}

            {(isGlobalModerator || isGlobalOwner) && (
              <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
                <OutlineButton icon={'settings'}>设置</OutlineButton>
              </Link>
            )}
          </Actions>
        </ProfileCard>
      </HoverWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
