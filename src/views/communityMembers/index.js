// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from '../../components/link';
import type { GetCommunityType } from '../../graphql/queries/community/getCommunity';
import ViewError from '../../components/viewError';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import CommunityMembers from './components/communityMembers';
import JoinTokenSettings from './components/joinTokenSettings';
import type { Dispatch } from 'redux';
import {
  SectionsContainer,
  Column,
} from '../../components/settingsViews/style';
import { ErrorBoundary, SettingsFallback } from '../../components/error';

type Props = {
  currentUser: Object,
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { community, history } = this.props;

    if (community && community.id) {
      return (
        <SectionsContainer>
          <Column>
            <ErrorBoundary fallbackComponent={SettingsFallback}>
              <CommunityMembers
                history={history}
                id={community.id}
                community={community}
              />
            </ErrorBoundary>
          </Column>

          <Column>
            {community.isPrivate && (
              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <JoinTokenSettings id={community.id} community={community} />
              </ErrorBoundary>
            )}
          </Column>
        </SectionsContainer>
      );
    }

    return (
      <ViewError
        heading={'你没有浏览这个社区的权限.'}
        subheading={
          '如果你想创建一个自己的社区，可以从下面开始.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>返回</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>创建一个社区</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map)
)(CommunityMembersSettings);
