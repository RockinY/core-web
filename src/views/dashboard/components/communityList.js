// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from '../../../components/link';
import Icon from '../../../components/icons';
import Reputation from '../../../components/reputation';
import UpsellExploreCommunities from './upsellExploreCommunities';
import SidebarChannels from './sidebarChannels';
import {
  CommunityListItem,
  CommunityListMeta,
  CommunityListName,
  CommunityListAvatar,
  CommunityListScroller,
  CommunityListWrapper,
  Fixed,
} from '../style';
import {
  changeActiveCommunity,
  changeActiveThread,
  changeActiveChannel,
} from '../../../actions/dashboardFeed';
import type { GetCommunityType } from '../../../graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from '../../../components/error';

type Props = {
  dispatch: Dispatch<Object>,
  history: Object,
  activeCommunity: ?string,
  activeChannel: ?string,
  communities: Array<GetCommunityType>,
  setActiveChannelObject: Function,
};

class CommunityList extends React.Component<Props> {
  changeCommunity = id => {
    this.props.dispatch(changeActiveCommunity(id));
    this.props.history.replace('/');
    this.props.dispatch(changeActiveThread(''));

    if (id !== this.props.activeCommunity) {
      this.props.dispatch(changeActiveChannel(''));
    }
  };

  clearActiveChannel = () => {
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(''));
  };

  handleOnClick = id => {
    this.clearActiveChannel();
    if (this.props.activeCommunity !== id) {
      this.changeCommunity(id);
    }
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;

    const changedActiveCommunity =
      curr.activeCommunity !== nextProps.activeCommunity;
    const changedActiveChannel = curr.activeChannel !== nextProps.activeChannel;
    const changedCommunitiesAmount =
      curr.communities.length !== nextProps.communities.length;

    if (
      changedActiveCommunity ||
      changedActiveChannel ||
      changedCommunitiesAmount
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { activeCommunity, activeChannel, communities } = this.props;
    const sortedCommunities = communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);

      // sort same-reputation communities alphabetically
      if (ac === bc) {
        return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
      }

      // otherwise sort by reputation
      return bc <= ac ? -1 : 1;
    });

    return (
      <CommunityListWrapper data-cy="inbox-community-list">
        <CommunityListScroller>
          <CommunityListItem
            active={!activeCommunity}
            onClick={() => this.changeCommunity('')}
          >
            <Icon glyph={'everything'} />
            <CommunityListName>所有内容</CommunityListName>
          </CommunityListItem>
          {sortedCommunities.map(c => (
            <ErrorBoundary fallbackComponent={null} key={c.id}>
              <CommunityListItem
                onClick={() => this.handleOnClick(c.id)}
                active={c.id === activeCommunity}
              >
                <CommunityListAvatar
                  active={c.id === activeCommunity}
                  src={c.profilePhoto}
                />
                <CommunityListMeta>
                  <CommunityListName>{c.name}</CommunityListName>
                  <Reputation
                    ignoreClick
                    size={'mini'}
                    tipText={`${c.name}的贡献`}
                    reputation={c.communityPermissions.reputation}
                  />
                </CommunityListMeta>

                {c.id === activeCommunity && (
                  <ErrorBoundary>
                    <SidebarChannels
                      activeChannel={activeChannel}
                      communitySlug={c.slug}
                      permissions={c.communityPermissions}
                      slug={c.slug}
                      id={c.id}
                      setActiveChannelObject={this.props.setActiveChannelObject}
                    />
                  </ErrorBoundary>
                )}
              </CommunityListItem>
            </ErrorBoundary>
          ))}
        </CommunityListScroller>

        <Fixed>
          <Link
            to={'/explore'}
          >
            <CommunityListItem>
              <Icon glyph={'explore'} />
              <CommunityListName>探索更多社区</CommunityListName>
            </CommunityListItem>
          </Link>
          {// if user has joined less than 5 communities, upsell some popular ones
          communities.length < 5 && (
            <ErrorBoundary fallbackComponent={null}>
              <UpsellExploreCommunities
                activeCommunity={activeCommunity}
                communities={communities}
                handleOnClick={this.handleOnClick}
                curatedContentType={'recommended'}
              />
            </ErrorBoundary>
          )}
        </Fixed>
      </CommunityListWrapper>
    );
  }
}

export default compose(connect(), withRouter)(CommunityList);
