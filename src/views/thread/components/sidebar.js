// @flow
import * as React from 'react';
import replace from 'string-replace-to-array';
import { withRouter } from 'react-router';
import { Button, TextButton } from '../../../components/buttons';
import type { GetThreadType } from '../../../graphql/queries/thread/getThread';
import {
  LoadingProfileThreadDetail,
  LoadingListThreadDetail,
} from '../../../components/loading';
import ToggleCommunityMembership from '../../../components/toggleCommunityMembership';
import Link from '../../../components/link';
import getCommunityThreads from '../../../graphql/queries/community/getCommunityThreadConnection';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import type { Dispatch } from 'redux';
import {
  SidebarSection,
  SidebarSectionTitle,
  SidebarSectionBody,
  SidebarSectionActions,
  SidebarSectionAuth,
  ThreadSidebarView,
  SidebarCommunityCover,
  SidebarCommunityProfile,
  SidebarCommunityName,
  SidebarCommunityDescription,
  SidebarRelatedThreadList,
  SidebarRelatedThread,
  RelatedTitle,
  RelatedCount,
  PillLink,
  PillLabel,
  Lock,
  SidebarChannelPill,
} from '../style';
import { ErrorBoundary } from '../../../components/error';
import type { ContextRouter } from 'react-router';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'

type RecommendedThread = {
  node: GetThreadType,
};
type Props = {
  ...$Exact<ContextRouter>,
  thread: GetThreadType,
  currentUser: Object,
  data: {
    threads: Array<RecommendedThread>,
  },
  toggleCommunityMembership: Function,
  dispatch: Dispatch<Object>,
  threadViewLoading?: boolean,
};

class Sidebar extends React.Component<Props> {
  render() {
    const {
      threadViewLoading,
      thread,
      currentUser,
      location,
      data: { threads },
    } = this.props;

    if (threadViewLoading) {
      return (
        <ThreadSidebarView>
          <SidebarSection>
            <LoadingProfileThreadDetail />
          </SidebarSection>
          <SidebarSection>
            <LoadingListThreadDetail />
          </SidebarSection>
        </ThreadSidebarView>
      );
    }

    const threadsToRender =
      threads &&
      threads.length > 0 &&
      threads
        .map(t => t.node)
        .filter(t => t.id !== thread.id)
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);
    const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;
    const renderDescriptionWithLinks = text => {
      return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
        <a href={url} target="_blank" rel="noopener nofollower" key={url}>
          {text}
        </a>
      ));
    };

    const loginUrl = thread.community.brandedLogin.isEnabled
      ? `/${thread.community.slug}/login?r=${CLIENT_URL}/thread/${thread.id}`
      : `/login?r=${CLIENT_URL}/thread/${thread.id}`;

    return (
      <ThreadSidebarView>
        {!currentUser && (
          <ErrorBoundary fallbackComponent={null}>
            <SidebarSection data-cy="thread-sidebar-login">
              <SidebarSectionTitle>加入对话</SidebarSectionTitle>
              <SidebarSectionBody>
                登陆一下，开始加入社区的聊天中吧
              </SidebarSectionBody>
              <SidebarSectionAuth>
                <Link to={loginUrl}>
                  <Button gradientTheme={'brand'} color={'brand.default'}>
                    注册
                  </Button>
                </Link>
                <Link to={loginUrl}>
                  <TextButton gradientTheme={'text'} color={'text.alt'}>
                    登陆
                  </TextButton>
                </Link>
              </SidebarSectionAuth>
            </SidebarSection>
          </ErrorBoundary>
        )}

        <ErrorBoundary fallbackComponent={null}>
          <SidebarSection data-cy="thread-sidebar-community-info">
            <Link to={`/${thread.community.slug}`}>
              <SidebarCommunityCover src={thread.community.coverPhoto} />
              <SidebarCommunityProfile
                community
                size={48}
                src={thread.community.profilePhoto}
              />
              <SidebarCommunityName>
                {thread.community.name}
              </SidebarCommunityName>
            </Link>

            <SidebarChannelPill>
              <PillLink to={`/${thread.community.slug}/${thread.channel.slug}`}>
                {thread.channel.isPrivate && (
                  <Lock>
                    <Icon glyph="private" size={12} />
                  </Lock>
                )}
                <PillLabel isPrivate={thread.channel.isPrivate}>
                  {thread.channel.name}
                </PillLabel>
              </PillLink>
            </SidebarChannelPill>

            <SidebarCommunityDescription>
              {renderDescriptionWithLinks(thread.community.description)}
            </SidebarCommunityDescription>

            <SidebarSectionActions>
              {thread.community.communityPermissions.isMember ? (
                <Link to={`/${thread.community.slug}`}>
                  <TextButton dataCy="thread-sidebar-view-community-button">
                    浏览社区
                  </TextButton>
                </Link>
              ) : currentUser ? (
                <ToggleCommunityMembership
                  community={thread.community}
                  render={({ isLoading }) => (
                    <Button
                      gradientTheme={'success'}
                      color={'success.default'}
                      loading={isLoading}
                      dataCy="thread-sidebar-join-community-button"
                    >
                      加入社区
                    </Button>
                  )}
                />
              ) : (
                <Link to={loginUrl}>
                  <Button
                    gradientTheme={'success'}
                    color={'success.default'}
                    dataCy="thread-sidebar-join-login-button"
                  >
                    加入社区
                  </Button>
                </Link>
              )}
            </SidebarSectionActions>
          </SidebarSection>
        </ErrorBoundary>

        {threadsToRender &&
          threadsToRender.length > 0 && (
            <ErrorBoundary fallbackComponent={null}>
              <SidebarSection data-cy="thread-sidebar-more-threads">
                <SidebarSectionTitle>More conversations</SidebarSectionTitle>
                <SidebarRelatedThreadList>
                  {threadsToRender.map(t => {
                    return (
                      <ErrorBoundary key={t.id} fallbackComponent={null}>
                        <SidebarRelatedThread key={t.id}>
                          <Link
                            to={{
                              pathname: location.pathname,
                              search: `?thread=${t.id}`,
                            }}
                          >
                            <RelatedTitle>{t.content.title}</RelatedTitle>
                            <RelatedCount>
                              {t.messageCount.toLocaleString()}{' '}
                              {t.messageCount === 1 ? 'message' : 'messages'}
                            </RelatedCount>
                          </Link>
                        </SidebarRelatedThread>
                      </ErrorBoundary>
                    );
                  })}
                </SidebarRelatedThreadList>
              </SidebarSection>
            </ErrorBoundary>
          )}
      </ThreadSidebarView>
    );
  }
}

// $FlowFixMe
export default compose(connect(), withRouter, getCommunityThreads)(Sidebar);
