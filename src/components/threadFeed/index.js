// @flow
import * as React from 'react';
import styled from 'styled-components';
import compose from 'recompose/compose';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from '../infiniteScroll';
import { deduplicateChildren } from '../infiniteScroll/deduplicateChildren';
import { connect } from 'react-redux';
import Link from '../link';
import Icon from '../icons';
import InboxThread from '../../views/dashboard/components/inboxThread';
import { NullCard } from '../upsell';
import { LoadingInboxThread } from '../loading';
import NewActivityIndicator from '../newActivityIndicator';
import ViewError from '../viewError';
import { Upsell, UpsellHeader, UpsellFooter } from './style';
import type { GetCommunityType } from '../../graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from '../error';

const NullState = ({ viewContext, search }) => {
  let hd;
  let cp;

  if (viewContext && viewContext === 'community') {
    hd = '这个社区还很年轻...';
    cp = '为什么不开始创作点内容呢?';
  }

  if (viewContext && viewContext === 'channel') {
    hd = '这个频道还是空的';
    cp = '做第一个吃螃蟹得人吧!';
  }

  if (viewContext && viewContext === 'profile') {
    hd = '这个用户还没有发布过什么';
    cp = '但是你可以直接和TA进行交流!';
  }

  if (search) {
    hd = '很抱歉，没有找到相关内容';
    cp = '可以再次尝试其他!';
  }

  return <NullCard bg="post" heading={hd} copy={cp} />;
};

const UpsellState = ({ community }) => (
  <Upsell>
    <UpsellHeader>
      <Icon glyph={'welcome'} size={48} />
      <h3>欢迎来到您得社区!</h3>
    </UpsellHeader>
    <p>
      你已经走出了一大步，唯一的问题是这里有点空荡荡，还没有别人光顾过你的社区!
    </p>
    <p>
      我们也知道这是您社区最困难的时刻，但是不要担心.
      这里有一些建议可以帮助您更好得开始您得社区
    </p>
    <p>
      首先最重要的一点，您可以<b>开始创建一些话题</b>.
    </p>
    <p>
      一些开放性得问题会是一个很好得尝试，例如:
      <ul>
        <li>让您得社区成员进行一下自我介绍</li>
        <li>
          问一下您得社区成员得爱好和关注点
        </li>
        <li>询问一下您最近遇到得一些问题</li>
      </ul>
    </p>
    <p>
      在开始了一些话题之后，下一步就是{' '}
      <b>帮助你得朋友更方便得找到您得社区</b>. 您可以尝试在相关得社交网站上分享您得社区话题.
    </p>
    <p>
      您也可以 <b>给您得朋友发送邮件邀请</b> or{' '}
      <Link to={`/${community.slug}/settings`}>设置</Link>.
    </p>
    <UpsellFooter>
      <p>
        如果遇到了任何使用上的问题欢迎添加官方微信进行问题反馈。
      </p>
    </UpsellFooter>
  </Upsell>
);

const Threads = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-self: stretch;
  align-items: stretch;

  > div {
    display: flex;
    flex: none;
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
  }
`;

type Props = {
  data: {
    subscribeToUpdatedThreads: Function,
    fetchMore: Function,
    networkStatus: number,
    hasNextPage: boolean,
    error: ?Object,
    community?: any,
    channel?: any,
    threads?: Array<any>,
  },
  community: GetCommunityType,
  setThreadsStatus: Function,
  hasThreads: Function,
  hasNoThreads: Function,
  currentUser: ?Object,
  viewContext?:
    | ?'communityInbox'
    | 'communityProfile'
    | 'channelInbox'
    | 'channelProfile'
    | 'userProfile',
  slug: string,
  pinnedThreadId: ?string,
  isNewAndOwned: ?boolean,
  newActivityIndicator: ?boolean,
  dispatch: Dispatch<Object>,
  search?: boolean,
};

type State = {
  scrollElement: any,
  subscription: ?Function,
};

class ThreadFeedPure extends React.Component<Props, State> {
  state = {
    scrollElement: null,
    subscription: null,
  };

  subscribe = () => {
    this.setState({
      subscription:
        this.props.data.subscribeToUpdatedThreads &&
        this.props.data.subscribeToUpdatedThreads(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-thread-feed');

    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });

    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    const curr = this.props;

    if (
      // $FlowFixMe
      !prevProps.data.thread &&
      curr.data.threads &&
      curr.data.threads.length === 0
    ) {
      // if there are no threads, tell the parent container so that we can render upsells to community owners in the parent container
      if (curr.setThreadsStatus) {
        curr.setThreadsStatus();
      }

      if (curr.hasThreads) {
        curr.hasThreads();
      }

      if (curr.hasNoThreads) {
        curr.hasNoThreads();
      }
    }
  }

  render() {
    const {
      data: { threads, networkStatus, error },
      viewContext,
      newActivityIndicator,
    } = this.props;

    const { scrollElement } = this.state;
    const dataExists = threads && threads.length > 0;

    const threadNodes =
      threads && threads.length > 0
        ? threads
            .slice()
            .map(thread => thread.node)
            .filter(
              thread =>
                !thread.channel.channelPermissions.isBlocked &&
                !thread.community.communityPermissions.isBlocked
            )
        : [];

    let filteredThreads = threadNodes;
    if (
      this.props.data.community &&
      this.props.data.community.watercooler &&
      this.props.data.community.watercooler.id
    ) {
      filteredThreads = filteredThreads.filter(
        // $FlowIssue
        t => t.id !== this.props.data.community.watercooler.id
      );
    }
    if (
      this.props.data.community &&
      this.props.data.community.pinnedThread &&
      this.props.data.community.pinnedThread.id
    ) {
      filteredThreads = filteredThreads.filter(
        // $FlowIssue
        t => t.id !== this.props.data.community.pinnedThread.id
      );
    }

    const uniqueThreads = deduplicateChildren(filteredThreads, 'id');

    if (dataExists) {
      return (
        <Threads data-cy="thread-feed">
          {newActivityIndicator && (
            <NewActivityIndicator elem="scroller-for-thread-feed" />
          )}

          {this.props.data.community &&
            this.props.data.community.pinnedThread &&
            this.props.data.community.pinnedThread.id && (
              <ErrorBoundary fallbackComponent={null}>
                <InboxThread
                  data={this.props.data.community.pinnedThread}
                  viewContext={viewContext}
                  pinnedThreadId={this.props.data.community.pinnedThread.id}
                />
              </ErrorBoundary>
            )}

          {this.props.data.community &&
            this.props.data.community.watercooler &&
            this.props.data.community.watercooler.id && (
              <ErrorBoundary fallbackComponent={null}>
                <InboxThread
                  data={this.props.data.community.watercooler}
                  viewContext={viewContext}
                />
              </ErrorBoundary>
            )}

          <InfiniteList
            pageStart={0}
            loadMore={this.props.data.fetchMore}
            isLoadingMore={this.props.data.networkStatus === 3}
            hasMore={this.props.data.hasNextPage}
            loader={<LoadingInboxThread />}
            useWindow={false}
            initialLoad={false}
            scrollElement={scrollElement}
            threshold={750}
            className={'threadfeed-infinite-scroll-div'}
          >
            {uniqueThreads.map(thread => {
              return (
                <ErrorBoundary fallbackComponent={null} key={thread.id}>
                  <InboxThread data={thread} viewContext={viewContext} />
                </ErrorBoundary>
              );
            })}
          </InfiniteList>
        </Threads>
      );
    }

    if (networkStatus <= 2) {
      return (
        <Threads>
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
          <LoadingInboxThread />
        </Threads>
      );
    }

    if (networkStatus === 8 || error) {
      return (
        <ViewError
          heading={'加载信息时出错了'}
          subheading={
            '请试着刷新一下浏览器. 如果问题仍然存在. 请联系官方客服.'
          }
          refresh
        />
      );
    }

    if (this.props.isNewAndOwned) {
      return <UpsellState community={this.props.community} />;
    } else {
      return <NullState search={this.props.search} viewContext={viewContext} />;
    }
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  newActivityIndicator: state.newActivityIndicator.hasNew,
});
const ThreadFeed = compose(
  // $FlowIssue
  connect(map)
)(ThreadFeedPure);

export default ThreadFeed;
