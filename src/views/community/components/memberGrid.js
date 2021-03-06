// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InfiniteList from '../../../components/infiniteScroll';
import { deduplicateChildren } from '../../../components/infiniteScroll/deduplicateChildren';
import Icon from '../../../components/icons';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import { withRouter } from 'react-router';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from '../../../graphql/queries/community/getCommunityMembers';
import { Card } from '../../../components/card';
import { Loading, LoadingListItem } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { MessageIconContainer, UserListItemContainer } from '../style';
import GranularUserProfile from '../../../components/granularUserProfile';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
  },
  dispatch: Dispatch<Object>,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
  currentUser: ?Object,
};

type State = {
  scrollElement: any,
};

class CommunityMemberGrid extends React.Component<Props, State> {
  state = { scrollElement: null };

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
    });
  }

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    // $FlowFixMe
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  render() {
    const { data: { community }, isLoading, currentUser } = this.props;
    const { scrollElement } = this.state;

    if (community) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);
      const uniqueNodes = deduplicateChildren(nodes, 'id');
      const hasNextPage = community.members.pageInfo.hasNextPage;

      return (
        <InfiniteList
          pageStart={0}
          loadMore={this.props.data.fetchMore}
          isLoadingMore={this.props.isFetchingMore}
          hasMore={hasNextPage}
          loader={
            <UserListItemContainer>
              <LoadingListItem />
            </UserListItemContainer>
          }
          useWindow={false}
          initialLoad={false}
          scrollElement={scrollElement}
          threshold={750}
          className={'scroller-for-community-members-list'}
        >
          {uniqueNodes.map(node => {
            if (!node) return null;

            const { user, roles, reputation } = node;
            return (
              <GranularUserProfile
                key={user.id}
                userObject={user}
                name={user.name}
                username={user.username}
                profilePhoto={user.profilePhoto}
                description={user.description}
                isCurrentUser={currentUser && user.id === currentUser.id}
                isOnline={user.isOnline}
                onlineSize={'small'}
                badges={roles}
                reputation={reputation}
              >
                {currentUser &&
                  user.id !== currentUser.id && (
                    <MessageIconContainer>
                      <Icon
                        glyph={'message'}
                        onClick={() => this.initMessage(user)}
                      />
                    </MessageIconContainer>
                  )}
              </GranularUserProfile>
            );
          })}
        </InfiniteList>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={'无法获取社区下的成员.'}
        />
      </Card>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withRouter,
  getCommunityMembersQuery,
  viewNetworkHandler
)(CommunityMemberGrid);
