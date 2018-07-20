// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getChannelByMatch } from '../../graphql/queries/channel/getChannel';
import type { GetChannelType } from '../../graphql/queries/channel/getChannel';
import AppViewWrapper from '../../components/appViewWrapper';
import { Loading } from '../../components/loading';
import { addToastWithTimeout } from '../../actions/toasts';
import { Upsell404Channel } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import togglePendingUserInChannelMutation from '../../graphql/mutations/channel/toggleChannelPendingUser';
import type { ToggleChannelPendingUserType } from '../../graphql/mutations/channel/toggleChannelPendingUser';
import unblockUserInChannelMutation from '../../graphql/mutations/channel/unblockChannelBlockedUser';
import type { UnblockChannelBlockedUserType } from '../../graphql/mutations/channel/unblockChannelBlockedUser';
import Titlebar from '../titlebar';
import ViewError from '../../components/viewError';
import { View } from '../../components/settingsViews/style';
import Header from '../../components/settingsViews/header';
import Overview from './components/overview';
import Subnav from '../../components/settingsViews/subnav';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    channel: GetChannelType,
  },
  location: Object,
  match: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
  togglePendingUser: Function,
  unblockUser: Function,
  history: Object,
};

class ChannelSettings extends React.Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  togglePending = (userId, action) => {
    const { data: { channel }, dispatch } = this.props;
    const input = {
      channelId: channel.id,
      userId,
      action,
    };

    this.props
      .togglePendingUser(input)
      .then(({ data }: ToggleChannelPendingUserType) => {
        // the mutation returns a channel object. if it exists,
        const { togglePendingUser } = data;
        if (togglePendingUser !== undefined) {
          if (action === 'block') {
          }

          if (action === 'approve') {
          }

          dispatch(addToastWithTimeout('success', '已保存!'));
        }
        return;
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  unblock = (userId: string) => {
    const { data: { channel }, dispatch } = this.props;

    const input = {
      channelId: channel.id,
      userId,
    };

    this.props
      .unblockUser(input)
      .then(({ data }: UnblockChannelBlockedUserType) => {
        const { unblockUser } = data;
        // the mutation returns a channel object. if it exists,
        if (unblockUser !== undefined) {
          dispatch(addToastWithTimeout('success', '用户已被取消屏蔽.'));
        }
        return;
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { channel },
      match,
      location,
      isLoading,
      hasError,
    } = this.props;
    const { communitySlug, channelSlug } = match.params;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);

    if (channel && channel.id) {
      const { isModerator, isOwner } = channel.channelPermissions;
      const userHasPermissions =
        isOwner ||
        isModerator ||
        channel.community.communityPermissions.isOwner ||
        channel.community.communityPermissions.isModerator;

      if (!userHasPermissions) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={'频道设置'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              heading={'你没有管理这个频道的权限.'}
              subheading={`返回.`}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      const ActiveView = () => {
        switch (activeTab) {
          case 'settings':
            return (
              <Overview
                community={channel.community}
                channel={channel}
                communitySlug={communitySlug}
                togglePending={this.togglePending}
                unblock={this.unblock}
                initMessage={this.initMessage}
              />
            );
          default:
            return null;
        }
      };

      const subnavItems = [
        {
          to: `/${channel.community.slug}/${channel.slug}/settings`,
          label: '概述',
          activeLabel: 'settings',
        },
      ];

      const subheading = {
        to: `/${channel.community.slug}/settings`,
        label: `返回社区 - ${channel.community.name}的设置`,
      };

      return (
        <AppViewWrapper>
          <Titlebar
            title={`${channel.name} · ${channel.community.name}`}
            subtitle={'设置'}
            provideBack={true}
            backRoute={`/${channel.community.slug}/${channel.slug}`}
            noComposer
          />

          <View id="main">
            <Header
              subheading={subheading}
              heading={`${channel.name} 设置 ${
                channel.isArchived ? '(已归档)' : ''
              }`}
            />
            <Subnav items={subnavItems} activeTab={activeTab} />

            <ActiveView />
          </View>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'频道无法找到'}
            provideBack={true}
            backRoute={`/${communitySlug}/${channelSlug}`}
            noComposer
          />
          <ViewError
            refresh
            heading={'获取频道信息失败.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'频道无法找到'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'找不到与这个名字对应的频道.'}
          subheading={`返回.`}
        >
          <Upsell404Channel community={communitySlug} />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(
  // $FlowIssue
  connect(),
  withRouter,
  getChannelByMatch,
  togglePendingUserInChannelMutation,
  unblockUserInChannelMutation,
  viewNetworkHandler
)(ChannelSettings);
