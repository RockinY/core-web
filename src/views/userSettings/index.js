// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import getCurrentUserSettings, {
  type GetCurrentUserSettingsType,
} from '../../graphql/queries/user/getCurrentUserSettings';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import Head from '../../components/head';
import ViewError from '../../components/viewError';
import { View } from './style';
import Overview from './components/overview';
import Titlebar from '../titlebar';
import Header from '../../components/settingsViews/header';
import Subnav from '../../components/settingsViews/subnav';
import type { ContextRouter } from 'react-router';

type Props = {
  data: {
    user: GetCurrentUserSettingsType,
  },
  isLoading: boolean,
  hasError: boolean,
  ...$Exact<ContextRouter>
};

class UserSettings extends React.Component<Props> {
  render() {
    const {
      data: { user },
      location,
      match,
      isLoading,
      hasError,
      // $FlowFixMe
      currentUser,
    } = this.props;

    // this is hacky, but will tell us if we're viewing analytics or the root settings view
    const pathname = location.pathname;
    const lastIndex = pathname.lastIndexOf('/');
    const activeTab = pathname.substr(lastIndex + 1);

    if (isLoading) {
      return <Loading />;
    }

    // the user is logged in but somehow a user wasnt fetched from the server prompt a refresh to reauth the user
    if ((currentUser && !user) || (currentUser && !user && !user.id)) {
      return (
        <React.Fragment>
          <Titlebar
            title={'用户无法找到'}
            provideBack={true}
            backRoute={'/'}
            noComposer
          />
          <AppViewWrapper>
            <ViewError
              heading={'获取用户的设置失败.'}
              subheading={
                '如果你正在试着查看自己的设置，请尝试刷新一下页面.'
              }
              clearStorage
              refresh
            />
          </AppViewWrapper>
        </React.Fragment>
      );
    }

    // if the user isn't logged in, or for some reason the user settings that were returned don't match the user id in the store, we show a warning error state
    if (!currentUser || user.id !== currentUser.id) {
      return (
        <React.Fragment>
          >
          <Titlebar
            title={'用户无法找到'}
            provideBack={true}
            backRoute={'/'}
            noComposer
          />
          <AppViewWrapper>
            <ViewError
              heading={'获取用户的设置失败.'}
              subheading={
                '你只能浏览自己的个人用户设置.'
              }
            />
          </AppViewWrapper>
        </React.Fragment>
      );
    }

    // user is viewing their own settings, validated on the server
    if (user && user.id && currentUser.id === user.id) {
      const subnavItems = [
        {
          to: `/users/${user.username}/settings`,
          label: '概述',
          activeLabel: 'settings',
        },
      ];

      const subheading = {
        to: `/users/${user.username}`,
        label: `返回个人主页`,
      };

      const avatar = {
        profilePhoto: user.profilePhoto,
        user,
      };

      return (
        <AppViewWrapper data-cy="user-settings">
          <Titlebar
            title={'设置'}
            subtitle={user.name}
            provideBack={true}
            backRoute={`/users/${user.username}`}
            noComposer
          />
          <Head title={`${user.name}的设置`} />

          <View id="main">
            <Header
              avatar={avatar}
              subheading={subheading}
              heading={'My Settings'}
            />

            <Subnav items={subnavItems} activeTab={activeTab} />

            <Route path={`${match.url}`}>
              {() => <Overview user={user} />}
            </Route>
          </View>
        </AppViewWrapper>
      );
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Error fetching user'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <ViewError
            refresh
            heading={'There was an error fetching this user’s settings.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'No User Found'}
          provideBack={true}
          backRoute={`/`}
          noComposer
        />
        <ViewError heading={'We weren’t able to find this user’s settings.'} />
      </AppViewWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCurrentUserSettings,
  viewNetworkHandler
)(UserSettings);
