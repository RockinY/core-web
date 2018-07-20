// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from '../../components/link';
import { Button } from '../../components/buttons';
import generateMetaInfo from '../../utils/generateMetaInfo';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import Icon from '../../components/icons';
import AppViewWrapper from '../../components/appViewWrapper';
import ThreadFeed from '../../components/threadFeed';
import CommunityMemberGrid from './components/memberGrid';
import ToggleCommunityMembership from '../../components/toggleCommunityMembership';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../components/viewNetworkHandler';
import ViewError from '../../components/viewError';
import { LoadingScreen } from '../../components/loading';
import { CLIENT_URL } from '../../constants';
import { Upsell404Community } from '../../components/upsell';
import {
  SegmentedControl,
  Segment,
  DesktopSegment,
  MobileSegment,
} from '../../components/segmentedControl';
import {
  LoginButton,
  Grid,
  Meta,
  Content,
  Extras,
  ColumnHeading,
} from './style';
import getCommunityThreads from '../../graphql/queries/community/getCommunityThreadConnection';
import {
  getCommunityByMatch,
  type GetCommunityType,
} from '../../graphql/queries/community/getCommunity';
import ChannelList from './components/channelList';
import ModeratorList from './components/moderatorList';
import RequestToJoinCommunity from './components/requestToJoinCommunity';
import CommunityLogin from '../communityLogin';
import Login from '../login';
import { ErrorBoundary } from '../../components/error';

// $FlowFixMe
const CommunityThreadFeed = compose(connect(), getCommunityThreads)(ThreadFeed);

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  dispatch: Dispatch<Object>,
  toggleCommunityMembership: Function,
  currentUser: Object,
  match: {
    params: {
      communitySlug: string,
    },
  },
  data: {
    community: GetCommunityType,
  },
};

type State = {
  showComposerUpsell: boolean,
  selectedView: 'threads' | 'search' | 'members',
  isLeavingCommunity: boolean,
};

class CommunityView extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLeavingCommunity: false,
      showComposerUpsell: false,
      selectedView: 'threads',
    };
  }

  componentDidUpdate(prevProps) {
    // if the user is new and signed up through a community page, push
    // the community data into the store to hydrate the new user experience
    // with their first community they should join
    if (this.props.currentUser) return;

    this.props.dispatch(addCommunityToOnboarding(this.props.data.community));
  }

  setComposerUpsell = () => {
    const { data: { community } } = this.props;
    const communityExists = community && community.communityPermissions;
    if (!communityExists) return;

    const isNewAndOwned =
      community.communityPermissions.isOwner && community.metaData.members < 2;
    return this.setState({ showComposerUpsell: isNewAndOwned });
  };

  handleSegmentClick = label => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
    });
  };

  render () {
    const {
      match: { params },
      data: { community },
      currentUser,
      isLoading,
      hasError,
      match,
    } = this.props;
    const { communitySlug } = params;

    console.log(community);

    if (community && community.id) {
      // at this point the community exists and was fetched
      const { title, description } = generateMetaInfo({
        type: 'community',
        data: {
          name: community.name,
          description: community.description,
        },
      });

      const { showComposerUpsell, selectedView } = this.state;
      const {
        isMember,
        isOwner,
        isModerator,
        isPending,
        isBlocked,
      } = community.communityPermissions;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isLoggedIn = currentUser;

      if (isBlocked) {
        return (
          <AppViewWrapper data-cy="community-view">
            <Titlebar
              title={community.name}
              provideBack={true}
              backRoute={'/'}
              noComposer={!community.communityPermissions.isMember}
            />

            <Head
              title={title}
              description={description}
              image={community.profilePhoto}
            />

            <ViewError
              id="main"
              emoji={'✋'}
              heading={`你没有浏览社区 - ${community.name}的权限`}
              subheading={'返回.'}
            >
              <Link to={'/'}>
                <Button large>Take me home</Button>
              </Link>
            </ViewError>
          </AppViewWrapper>
        );
      }

      const redirectPath = `${CLIENT_URL}/${community.slug}`;

      if (!currentUser && community.isPrivate) {
        if (community.brandedLogin.isEnabled) {
          return <CommunityLogin redirectPath={redirectPath} match={match} />;
        } else {
          return <Login redirectPath={redirectPath} />;
        }
      }

      if (community.isPrivate && (!isLoggedIn || !userHasPermissions)) {
        return (
          <AppViewWrapper data-cy="community-view-blocked">
            <Head
              title={title}
              description={`云社上面的社区 - ${community.name}`}
              image={community.profilePhoto}
            />

            <Titlebar
              title={community.name}
              provideBack={true}
              backRoute={'/'}
              noComposer
            />

            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? '您的加入社区请求仍然处于等待状态'
                  : '这个社区是私有的'
              }
              subheading={
                isPending
                  ? `受到进一步消息之前先返回.`
                  : `请求加入社区，同时社区 - ${
                      community.name
                    }的管理员将会收到相应消息.`
              }
              dataCy={'community-view-is-restricted'}
            >
              <RequestToJoinCommunity community={community} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // if the person viewing the community recently created this community,
      // we'll mark it as "new and owned" - this tells the downstream
      // components to show nux upsells to create a thread or invite people
      // to the community
      const isNewAndOwned = isOwner && community.metaData.members < 5;
      const loginUrl = community.brandedLogin.isEnabled
        ? `/${community.slug}/login?r=${CLIENT_URL}/${community.slug}`
        : `/login?r=${CLIENT_URL}/${community.slug}`;
      return (
        <AppViewWrapper data-cy="community-view">
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          />
          <Titlebar
            title={community.name}
            provideBack={true}
            backRoute={'/'}
            noComposer={!community.communityPermissions.isMember}
          />
          <Grid id="main">
            <CoverPhoto src={community.coverPhoto} />
            <Meta>
              <ErrorBoundary fallbackComponent={null}>
                <CommunityProfile data={{ community }} profileSize="full" />
              </ErrorBoundary>

              {!isLoggedIn ? (
                <Link to={loginUrl}>
                  <LoginButton dataCy={'join-community-button-login'}>
                    加入 {community.name}
                  </LoginButton>
                </Link>
              ) : !isOwner ? (
                <ToggleCommunityMembership
                  community={community}
                  render={state => (
                    <LoginButton
                      isMember={isMember}
                      gradientTheme={isMember ? null : 'success'}
                      color={isMember ? 'text.alt' : null}
                      icon={isMember ? 'checkmark' : null}
                      loading={state.isLoading}
                      dataCy={'join-community-button'}
                      style={{ marginTop: '16px' }}
                    >
                      {isMember ? '成员' : `加入 ${community.name}`}
                    </LoginButton>
                  )}
                />
              ) : null}

              {currentUser &&
                (isOwner || isModerator) && (
                  <Link to={`/${community.slug}/settings`}>
                    <LoginButton
                      icon={'settings'}
                      isMember
                      data-cy="community-settings-button"
                    >
                      设置
                    </LoginButton>
                  </Link>
                )}
            </Meta>
            <Content data-cy="community-view-content">
              <SegmentedControl style={{ margin: '16px 0 0 0' }}>
                <DesktopSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                  搜索
                </DesktopSegment>

                <Segment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  话题
                </Segment>

                <DesktopSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  成员 ({community.metaData &&
                    community.metaData.members &&
                    community.metaData.members.toLocaleString()})
                </DesktopSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  成员
                </MobileSegment>
                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                </MobileSegment>
              </SegmentedControl>

              {// if the user is logged in, is viewing the threads,
              // and is a member of the community, they should see a
              // new thread composer
              isLoggedIn &&
                selectedView === 'threads' &&
                userHasPermissions && (
                  <ErrorBoundary fallbackComponent={null}>
                    <ThreadComposer
                      activeCommunity={communitySlug}
                      showComposerUpsell={showComposerUpsell}
                    />
                  </ErrorBoundary>
                )}

              {// thread list
              selectedView === 'threads' && (
                <CommunityThreadFeed
                  viewContext="communityProfile"
                  slug={communitySlug}
                  id={community.id}
                  currentUser={isLoggedIn}
                  setThreadsStatus={
                    // $FlowFixMe
                    !this.showComposerUpsell && this.setComposerUpsell
                  }
                  isNewAndOwned={isNewAndOwned}
                  community={community}
                  pinnedThreadId={community.pinnedThreadId}
                />
              )}

              {// members grid
              selectedView === 'members' && (
                <ErrorBoundary>
                  <CommunityMemberGrid
                    id={community.id}
                    filter={{ isMember: true, isBlocked: false }}
                  />
                </ErrorBoundary>
              )}
            </Content>
            <Extras>
              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>频道</ColumnHeading>
                <ChannelList
                  id={community.id}
                  communitySlug={communitySlug.toLowerCase()}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>团队成员</ColumnHeading>
                <ModeratorList
                  id={community.id}
                  first={20}
                  filter={{ isModerator: true, isOwner: true }}
                />
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
            title={'=无法找到相应社区'}
            provideBack={true}
            backRoute={'/'}
            noComposer
          />
          <ViewError
            heading={'加载社区失败.'}
            refresh
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'社区无法找到'}
          provideBack={true}
          backRoute={'/'}
          noComposer
        />
        <ViewError
          heading={'无法找到相应社区.'}
          subheading={`如果你想创建这个社区，可以从下面开始.`}
        >
          <Upsell404Community />
        </ViewError>
      </AppViewWrapper>
    )
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  // $FlowIssue
  connect(map),
  getCommunityByMatch,
  viewNetworkHandler
)(CommunityView);
