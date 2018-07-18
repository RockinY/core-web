// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { Loading } from '../../../components/loading';
import GetMembers from './getMembers';
import EditDropdown from './editDropdown';
import Search from './search';
import queryString from 'query-string';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import {
  Filters,
  Filter,
  SearchFilter,
  SearchInput,
  SearchForm,
  FetchMore,
} from '../style';
import { ListContainer } from '../../../components/listItems/style';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import ViewError from '../../../components/viewError';
import GranularUserProfile from '../../../components/granularUserProfile';
import { Notice } from '../../../components/listItems/style';
import type { Dispatch } from 'redux';

type Props = {
  id: string,
  client: Object,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  history: Object,
  location: Object,
  community: Object,
};

type State = {
  filter: ?{
    isMember?: boolean,
    isModerator?: boolean,
    isBlocked?: boolean,
  },
  searchIsFocused: boolean,
  // what the user types in
  searchString: string,
  // what gets sent to the server when hits enter
  queryString: string,
};

class CommunityMembers extends React.Component<Props, State> {
  initialState = {
    filter: { isMember: true, isBlocked: false },
    searchIsFocused: false,
    searchString: '',
    queryString: '',
  };

  state = this.initialState;

  componentDidMount() {
    const { filter } = queryString.parse(this.props.location.search);
    if (!filter) return;

    if (filter === 'pending') {
      return this.viewPending();
    }

    if (filter === 'moderators') {
      return this.viewModerators();
    }

    if (filter === 'blocked') {
      return this.viewBlocked();
    }
  }

  viewMembers = () => {
    return this.setState({
      filter: { isMember: true, isBlocked: false },
      searchIsFocused: false,
    });
  };

  viewPending = () => {
    return this.setState({
      filter: { isPending: true },
      searchIsFocused: false,
    });
  };

  viewModerators = () => {
    return this.setState({
      filter: { isModerator: true },
      searchIsFocused: false,
    });
  };

  viewBlocked = () => {
    return this.setState({
      filter: { isBlocked: true },
      searchIsFocused: false,
    });
  };

  handleChange = (e: any) => {
    const searchString = e.target && e.target.value;

    if (!searchString || searchString.length === 0) {
      return this.setState({
        searchString: '',
        queryString: '',
      });
    }

    return this.setState({
      searchString: searchString,
    });
  };

  initSearch = () => this.setState({ filter: null, searchIsFocused: true });

  search = e => {
    e.preventDefault();
    const { searchString } = this.state;
    if (!searchString || searchString.length === 0) return;
    return this.setState({ queryString: searchString });
  };

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  generateUserProfile = communityMember => {
    const { user, roles, reputation, ...permissions } = communityMember;
    return (
      <GranularUserProfile
        userObject={user}
        key={user.id}
        id={user.id}
        name={user.name}
        username={user.username}
        description={user.description}
        isCurrentUser={user.id === this.props.currentUser.id}
        isOnline={user.isOnline}
        onlineSize={'small'}
        reputation={reputation}
        profilePhoto={user.profilePhoto}
        avatarSize={'40'}
        badges={roles}
      >
        {user.id !== this.props.currentUser.id && (
          <EditDropdown
            user={user}
            permissions={permissions}
            community={this.props.community}
          />
        )}
      </GranularUserProfile>
    );
  };

  render() {
    const { filter, searchIsFocused, searchString, queryString } = this.state;
    const { id, community } = this.props;

    return (
      <SectionCard>
        <SectionTitle>
          社区成员 · {community.metaData.members.toLocaleString()}
        </SectionTitle>

        <Filters>
          <Filter
            onClick={this.viewMembers}
            active={filter && filter.isMember ? true : false}
          >
            成员
          </Filter>
          <Filter
            onClick={this.viewModerators}
            active={filter && filter.isModerator ? true : false}
          >
            团队
          </Filter>
          <Filter
            onClick={this.viewBlocked}
            active={filter && filter.isBlocked ? true : false}
          >
            屏蔽
          </Filter>

          {community.isPrivate && (
            <Filter
              onClick={this.viewPending}
              // $FlowFixMe
              active={filter && filter.isPending ? true : false}
            >
              等待
            </Filter>
          )}

          <SearchFilter onClick={this.initSearch}>
            <SearchForm onSubmit={this.search}>
              <Icon glyph={'search'} size={28} />
              <SearchInput
                onChange={this.handleChange}
                type={'text'}
                placeholder={'搜索'}
              />
            </SearchForm>
          </SearchFilter>
        </Filters>

        {searchIsFocused &&
          queryString && (
            <Search
              queryString={queryString}
              filter={{ communityId: this.props.id }}
              render={({ searchResults, isLoading }) => {
                if (isLoading) {
                  return <Loading />;
                }

                if (!searchResults || searchResults.length === 0) {
                  const emoji = ' ';

                  const heading =
                    searchString.length > 1
                      ? `我们找不到任何人符合 "${searchString}"`
                      : '搜索你社区的成员';

                  const subheading =
                    searchString.length > 1
                      ? '通过分享来不断扩大您社区的影响力'
                      : '通过用户的用户名和描述来进行搜索';

                  return (
                    <ViewError
                      emoji={emoji}
                      heading={heading}
                      subheading={subheading}
                    />
                  );
                }

                return (
                  <ListContainer>
                    {searchResults.map(communityMember => {
                      if (!communityMember) return null;
                      return this.generateUserProfile(communityMember);
                    })}
                  </ListContainer>
                );
              }}
            />
          )}

        {searchIsFocused &&
          !queryString && (
            <ViewError
              emoji={' '}
              heading={'搜索社区成员'}
              subheading={
                '通过用户的用户名和描述来进行搜索!'
              }
            />
          )}

        {!searchIsFocused && (
          <GetMembers
            filter={filter}
            id={id}
            render={({ isLoading, community, isFetchingMore, fetchMore }) => {
              const members =
                community &&
                community.members &&
                community.members.edges.map(member => member && member.node);

              if (members && members.length > 0) {
                return (
                  <ListContainer data-cy="community-settings-members-list">
                    {filter &&
                      filter.isBlocked &&
                      !community.isPrivate && (
                        <Notice>
                          <strong>关于屏蔽用户的通知:</strong> 
                          你的社区是公共的(除了部分私有频道)，这意味着被屏蔽的用户
                          仍然可以看到您社区的内容和对话. 但是他们并不能创建新的对话
                          或者在任何现有的对话下面留言.
                        </Notice>
                      )}

                    {members.map(communityMember => {
                      if (!communityMember) return null;
                      return this.generateUserProfile(communityMember);
                    })}

                    {community &&
                      community.members.pageInfo.hasNextPage && (
                        <SectionCardFooter>
                          <FetchMore
                            color={'brand.default'}
                            loading={isFetchingMore}
                            onClick={fetchMore}
                          >
                            加载更多
                          </FetchMore>
                        </SectionCardFooter>
                      )}
                  </ListContainer>
                );
              }

              if (isLoading) {
                return <Loading />;
              }

              if (!members || members.length === 0) {
                if (filter && filter.isBlocked) {
                  return (
                    <ViewError
                      emoji={' '}
                      heading={'没有发现被屏蔽的用户'}
                      subheading={
                        '太棒了还没有用户被屏蔽！如果有新的被屏蔽用户，你可以在这里找到他们'
                      }
                    />
                  );
                }

                if (filter && filter.isMember) {
                  return (
                    <ViewError
                      emoji={' '}
                      heading={'没有找到社区成员'}
                      subheading={
                        "我们没有找到任何社区成员，太奇怪了..."
                      }
                    />
                  );
                }

                if (filter && filter.isModerator) {
                  return (
                    <ViewError
                      emoji={' '}
                      heading={'没有找到团队成员'}
                      subheading={
                        "你还没添加任何团队成员进入你的社区."
                      }
                    />
                  );
                }

                // $FlowFixMe
                if (filter && filter.isPending) {
                  return (
                    <ViewError
                      emoji={' '}
                      heading={'没有等待中的成员'}
                      subheading={
                        '您的社区没有发现等待中的成员.'
                      }
                    />
                  );
                }
              }

              return null;
            }}
          />
        )}
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  withRouter
)(CommunityMembers);
