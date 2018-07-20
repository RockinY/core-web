// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { getCommunitySettingsByMatch } from '../../graphql/queries/community/getCommunitySettings';
import type { GetCommunityType } from '../../graphql/queries/community/getCommunity';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import { Upsell404Community } from '../../components/upsell';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Head from '../../components/head';
import ViewError from '../../components/viewError';
import Members from '../communityMembers';
import Overview from './components/overview';
import Titlebar from '../titlebar';
import Header from '../../components/settingsViews/header';
import Subnav from '../../components/settingsViews/subnav';
import { View } from './style';
import type { ContextRouter } from 'react-router';

type Props = {
  data: {
    community: GetCommunityType,
  },
  isLoading: boolean,
  hasError: boolean,
  ...$Exact<ContextRouter>,
};

class CommunitySettings extends React.Component<Props> {
  render() {
    const {
      data: { community },
      location,
      match,
      isLoading,
      hasError,
      history,
    } = this.props;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);
    const communitySlug = match.params.communitySlug;

    if (community && community.id) {
      const canViewCommunitySettings =
        community.communityPermissions.isOwner ||
        community.communityPermissions.isModerator;

      if (!canViewCommunitySettings) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={'No Permission'}
              provideBack={true}
              // $FlowFixMe
              backRoute={`/${communitySlug}`}
              noComposer
            />

            <ViewError
              heading={'=你没有管理这个社区的权限.'}
              subheading={
                '如果你想创建自己的社区，可以从下面开始.'
              }
            >
              <Upsell404Community />
            </ViewError>
          </AppViewWrapper>
        );
      }

      const subnavItems = [
        {
          to: `/${community.slug}/settings`,
          label: '概述',
          activeLabel: 'settings',
        },
        {
          to: `/${community.slug}/settings/members`,
          label: '成员',
          activeLabel: 'members',
        },
        // {
        //   to: `/${community.slug}/settings/analytics`,
        //   label: '分析',
        //   activeLabel: 'analytics',
        // },
      ];

      // if (community.communityPermissions.isOwner) {
      //   subnavItems.push({
      //     to: `/${community.slug}/settings/billing`,
      //     label: '会员',
      //     activeLabel: 'billing',
      //   });
      // }

      const subheading = {
        to: `/${community.slug}`,
        label: `返回 ${community.name}`,
      };

      const avatar = {
        profilePhoto: community.profilePhoto,
        community,
      };

      const activeItem = subnavItems.find(
        ({ activeLabel }) => activeLabel === activeTab
      );
      let title = community.name;
      if (activeItem && activeItem.label !== '设置') {
        title += ` ${activeItem.label}设置`;
      } else {
        title += '设置';
      }
      return (
        <AppViewWrapper data-cy="community-settings">
          <Titlebar
            title={community.name}
            subtitle={'设置'}
            provideBack={true}
            // $FlowFixMe
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <Head title={title} />

          <View id="main">
            <Header
              avatar={avatar}
              subheading={subheading}
              heading={'设置'}
            />
            <Subnav items={subnavItems} activeTab={activeTab} />

            <Switch>
              <Route path={`${match.url}/members`}>
                {/* $FlowFixMe */}
                {() => <Members community={community} history={history} />}
              </Route>
              <Route path={`${match.url}`}>
                {() => (
                  <Overview
                    community={community}
                    // $FlowFixMe
                    communitySlug={communitySlug}
                  />
                )}
              </Route>
            </Switch>
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
            title={'无法加载社区'}
            provideBack={true}
            // $FlowFixMe
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            refresh
            error={hasError}
            heading={'加载社区设置出错了.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'找不到社区'}
          provideBack={true}
          // $FlowFixMe
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'找不到对应社区信息.'}
          // $FlowFixMe
          subheading={`如果你想创建一个自己的社区，可以从下面开始.`}
        >
          <Upsell404Community />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(
  connect(),
  getCommunitySettingsByMatch,
  viewNetworkHandler
)(CommunitySettings);
