// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from '../../utils/generateMetaInfo';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import AppViewWrapper from '../../components/appViewWrapper';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import Link from '../../components/link';
import ThreadFeed from '../../components/threadFeed';
import { ChannelProfile } from '../../components/profile';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import getChannelThreadConnection from '../../graphql/queries/channel/getChannelThreadConnection';
import { getChannelByMatch } from '../../graphql/queries/channel/getChannel';
import type { GetChannelType } from '../../graphql/queries/channel/getChannel';
import Login from '../login';
import { LoadingScreen } from '../../components/loading';
import { Upsell404Channel } from '../../components/upsell';
import RequestToJoinChannel from '../../components/upsell/requestToJoinChannel';
import Titlebar from '../titlebar';
import Icon from '../../components/icons';
import Search from './components/search';
import ChannelMemberGrid from './components/memberGrid';
import { CLIENT_URL } from '../../constants';
import CommunityLogin from '../communityLogin';
import {
  SegmentedControl,
  DesktopSegment,
  Segment,
  MobileSegment,
} from '../../components/segmentedControl';
import { Grid, Meta, Content, Extras } from './style';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import { LoginButton, ColumnHeading, MidSegment } from '../community/style';
import ToggleChannelMembership from '../../components/toggleChannelMembership';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from '../../components/error';

// $FlowFixMe
const ThreadFeedWithData = compose(connect(), getChannelThreadConnection)(
  ThreadFeed
);

type Props = {
  match: {
    params: {
      communitySlug: string,
      channelSlug: string,
    },
  },
  data: {
    channel: GetChannelType,
  },
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
};

type State = {
  selectedView: 'threads' | 'search' | 'members',
};

class ChannelView extends React.Component<Props, State> {
  state = {
    selectedView: 'threads',
  };

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.data.channel && this.props.data.channel) ||
      (prevProps.data.channel &&
        prevProps.data.channel.id !== this.props.data.channel.id)
    ) {
      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      if (this.props.currentUser) return;
      this.props.dispatch(
        addCommunityToOnboarding(this.props.data.channel.community)
      );
    }
  }

  handleSegmentClick = label => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
    });
  };

  renderActionButton = (channel: GetChannelType) => {
    if (!channel) return null;

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

    const loginUrl = channel.community.brandedLogin.isEnabled
      ? `/${channel.community.slug}/login?r=${CLIENT_URL}/${
          channel.community.slug
        }/${channel.slug}`
      : `/login?r=${CLIENT_URL}/${channel.community.slug}/${channel.slug}`;

    // logged in
    if (!this.props.currentUser) {
      // user isnt logged in, prompt a login-join
      return (
        <Link to={loginUrl}>
          <LoginButton data-cy="channel-login-join-button">
            加入 {channel.name}
          </LoginButton>
        </Link>
      );
    }

    // logged out
    if (this.props.currentUser) {
      // show settings button if owns channel or community
      if (isGlobalOwner) {
        return (
          <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
            <LoginButton
              icon={'settings'}
              isMember
              data-cy="channel-settings-button"
            >
              设置
            </LoginButton>
          </Link>
        );
      }

      if (isGlobalModerator) {
        return (
          <React.Fragment>
            <ToggleChannelMembership
              channel={channel}
              render={state => (
                <LoginButton
                  isMember={isChannelMember}
                  icon={isChannelMember ? 'checkmark' : null}
                  loading={state.isLoading}
                  dataCy="channel-join-button"
                >
                  {isChannelMember ? '已加入' : `加入 ${channel.name}`}
                </LoginButton>
              )}
            />

            <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
              <LoginButton
                icon={'settings'}
                isMember
                data-cy="channel-settings-button"
              >
                设置
              </LoginButton>
            </Link>
          </React.Fragment>
        );
      }

      // otherwise prompt a join
      return (
        <ToggleChannelMembership
          channel={channel}
          render={state => (
            <LoginButton
              isMember={isChannelMember}
              icon={isChannelMember ? 'checkmark' : null}
              loading={state.isLoading}
              dataCy="channel-join-button"
            >
              {isChannelMember ? '已加入' : `加入 ${channel.name}`}
            </LoginButton>
          )}
        />
      );
    }
  };

  render() {
    const {
      match,
      data: { channel },
      currentUser,
      isLoading,
      hasError,
    } = this.props;
    const { selectedView } = this.state;
    const { communitySlug, channelSlug } = match.params;
    const isLoggedIn = currentUser;

    if (channel && channel.id) {
      // at this point the view is no longer loading, has not encountered an error, and has returned a channel record
      const {
        isBlocked,
        isPending,
        isMember,
        isOwner,
        isModerator,
      } = channel.channelPermissions;
      const { community } = channel;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isRestricted = channel.isPrivate && !userHasPermissions;
      const hasCommunityPermissions =
        !community.isPrivate || community.communityPermissions.isMember;
      const isGlobalOwner =
        isOwner || channel.community.communityPermissions.isOwner;

      const redirectPath = `${CLIENT_URL}/${community.slug}/${channel.slug}`;

      // if the channel is private but the user isn't logged in, redirect to the login page
      if (!isLoggedIn && channel.isPrivate) {
        if (community.brandedLogin.isEnabled) {
          return <CommunityLogin redirectPath={redirectPath} match={match} />;
        } else {
          return <Login redirectPath={redirectPath} />;
        }
      }

      // user has explicitly been blocked from this channel
      if (
        isBlocked ||
        community.communityPermissions.isBlocked ||
        !hasCommunityPermissions
      ) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={'Private channel'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              emoji={'✋'}
              heading={'你没有进入这个频道的权限.'}
              subheading={`返回.`}
              dataCy={'channel-view-blocked'}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // channel is private and the user is not a member or owner
      if (isRestricted) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={channel.name}
              subtitle={community.name}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? '您的频道加入请求正在处理中'
                  : '这个频道是私人的'
              }
              subheading={
                isPending
                  ? `有新消息之前先返回社区 - ${
                      community.name
                    }.`
                  : `请求加入这个频道，社区 - ${
                      community.name
                    }的管理员会收到相应通知.`
              }
              dataCy={'channel-view-is-restricted'}
            >
              <RequestToJoinChannel
                channel={channel}
                community={community}
                isPending={isPending}
              />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // at this point the user has full permission to view the channel
      const { title, description } = generateMetaInfo({
        type: 'channel',
        data: {
          name: channel.name,
          communityName: community.name,
          description: channel.description,
        },
      });

      const actionButton = this.renderActionButton(channel);

      return (
        <AppViewWrapper data-cy="channel-view">
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          />
          <Titlebar
            title={channel.name}
            subtitle={community.name}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer={!isMember}
          />
          <Grid id="main">
            <CoverPhoto src={community.coverPhoto} />
            <Meta>
              <ErrorBoundary fallbackComponent={null}>
                <ChannelProfile data={{ channel }} profileSize="full" />
              </ErrorBoundary>

              {actionButton}

              {isLoggedIn &&
                userHasPermissions &&
                !channel.isArchived && (
                  <ErrorBoundary fallbackComponent={null}>
                    <NotificationsToggle
                      value={channel.channelPermissions.receiveNotifications}
                      channel={channel}
                    />
                  </ErrorBoundary>
                )}

              {/* user is signed in and has permissions to view pending users */}
              {isLoggedIn &&
                (isOwner || isGlobalOwner) && (
                  <ErrorBoundary fallbackComponent={null}>
                    <PendingUsersNotification
                      channel={channel}
                      id={channel.id}
                    />
                  </ErrorBoundary>
                )}
            </Meta>
            <Content>
              <SegmentedControl style={{ margin: '16px 0 0 0' }}>
                <DesktopSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                  data-cy="channel-search-tab"
                >
                  <Icon glyph={'search'} />
                  Search
                </DesktopSegment>
                <Segment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  Threads
                </Segment>
                <MidSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members ({channel.metaData &&
                    channel.metaData.members &&
                    channel.metaData.members.toLocaleString()})
                </MidSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members
                </MobileSegment>
                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                </MobileSegment>
              </SegmentedControl>

              {/* if the user is logged in and has permissions to post, and the channel is either private + paid, or is not private, show the composer */}
              {isLoggedIn &&
                !channel.isArchived &&
                selectedView === 'threads' &&
                userHasPermissions &&
                ((channel.isPrivate && !channel.isArchived) ||
                  !channel.isPrivate) && (
                  <ErrorBoundary fallbackComponent={null}>
                    <ThreadComposer
                      activeCommunity={communitySlug}
                      activeChannel={channelSlug}
                    />
                  </ErrorBoundary>
                )}

              {// thread list
              selectedView === 'threads' && (
                <ThreadFeedWithData
                  viewContext="channelProfile"
                  id={channel.id}
                  currentUser={isLoggedIn}
                  channelId={channel.id}
                />
              )}

              {//search
              selectedView === 'search' && (
                <ErrorBoundary>
                  <Search channel={channel} />
                </ErrorBoundary>
              )}

              {// members grid
              selectedView === 'members' && (
                <ErrorBoundary>
                  <ChannelMemberGrid id={channel.id} />
                </ErrorBoundary>
              )}
            </Content>
            <Extras>
              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>Members</ColumnHeading>
                <ChannelMemberGrid first={5} id={channel.id} />
              </ErrorBoundary>
            </Extras>
          </Grid>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Channel not found'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            refresh
            heading={'获取频道失败.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'找不到这个频道'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'找不到这个名字的频道.'}
          subheading={`返回.`}
          dataCy="channel-not-found"
        >
          <Upsell404Channel community={communitySlug} />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  // $FlowIssue
  connect(map),
  getChannelByMatch,
  viewNetworkHandler
)(ChannelView);
