// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import approvePendingCommunityMember from '../../../graphql/mutations/communityMember/approvePendingCommunityMember';
import blockPendingCommunityMember from '../../../graphql/mutations/communityMember/blockPendingCommunityMember';
import { Button, OutlineButton } from '../../../components/buttons';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  RequestContext,
  Content,
  ContentWash,
  AttachmentsWash,
  ButtonsRow,
} from '../style';
import Icon from '../../../components/icons';
import { CardContent } from '../../../components/threadFeedCard/style';
import compose from 'recompose/compose';
import markSingleNotificationSeenMutation from '../../../graphql/mutations/notification/markSingleNotificationSeen';
import MutationWrapper from '../../../views/communityMembers/components/mutationWrapper';
import GetCommunityMember from './getCommunityMember';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen?: Function,
  markSingleNotificationAsSeenInState?: Function,
  approvePendingCommunityMember: Function,
  blockPendingCommunityMember: Function,
};

class PrivateCommunityRequestSentComponent extends React.Component<Props> {
  render() {
    const {
      notification,
      currentUser,
      approvePendingCommunityMember,
      blockPendingCommunityMember,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    const input = {
      communityId: notification.context.id,
      userId: notification.actors[0].id,
    };

    return (
      <SegmentedNotificationCard>
        <Link
          to={`/${
            notification.context.payload.slug
          }/settings/members?filter=pending`}
        >
          <CardContent>
            <RequestContext style={{ padding: '0 16px' }}>
              <Icon glyph="person" />
              <ActorsRow actors={actors.asObjects} />
            </RequestContext>
          </CardContent>
          <Content style={{ padding: '0 16px 16px' }}>
            <TextContent pointer={false}>
              {' '}
              {actors.asString} {event} the{' '}
              <Link to={`/${notification.context.payload.slug}`}>
                {notification.context.payload.name}
              </Link>{' '}
              community {date}{' '}
            </TextContent>
          </Content>
        </Link>
        <GetCommunityMember
          userId={input.userId}
          communityId={input.communityId}
          render={({ communityMember }) => {
            if (!communityMember || !communityMember.isPending) return null;
            return (
              <ContentWash>
                <AttachmentsWash>
                  <ButtonsRow>
                    <MutationWrapper
                      mutation={blockPendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <OutlineButton loading={isLoading} glyph={'minus'}>
                          Block
                        </OutlineButton>
                      )}
                    />
                    <MutationWrapper
                      mutation={approvePendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <Button loading={isLoading} glyph={'plus'}>
                          Approve
                        </Button>
                      )}
                    />
                  </ButtonsRow>
                </AttachmentsWash>
              </ContentWash>
            );
          }}
        />
      </SegmentedNotificationCard>
    );
  }
}

export const PrivateCommunityRequestSent = compose(
  approvePendingCommunityMember,
  // $FlowFixMe
  blockPendingCommunityMember
)(PrivateCommunityRequestSentComponent);

class MiniPrivateCommunityRequestSentWithMutation extends React.Component<
  Props
> {
  markAsSeen = () => {
    const {
      markSingleNotificationSeen,
      notification,
      markSingleNotificationAsSeenInState,
    } = this.props;
    if (notification.isSeen) return;
    markSingleNotificationAsSeenInState &&
      markSingleNotificationAsSeenInState(notification.id);
    markSingleNotificationSeen && markSingleNotificationSeen(notification.id);
  };

  render() {
    const {
      notification,
      currentUser,
      approvePendingCommunityMember,
      blockPendingCommunityMember,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    const input = {
      communityId: notification.context.id,
      userId: notification.actors[0].id,
    };

    return (
      <SegmentedNotificationListRow
        isSeen={notification.isSeen}
        onClick={this.markAsSeen}
      >
        <Link
          to={`/${
            notification.context.payload.slug
          }/settings/members?filter=pending`}
        >
          <CardContent>
            <RequestContext style={{ padding: '0 16px' }}>
              <Icon glyph="person" />
              <ActorsRow actors={actors.asObjects} />
            </RequestContext>
          </CardContent>
          <Content style={{ padding: '0 16px 16px' }}>
            <TextContent pointer={false}>
              {' '}
              {actors.asString} {event} the{' '}
              <Link to={`/${notification.context.payload.slug}`}>
                {notification.context.payload.name}
              </Link>{' '}
              community {date}{' '}
            </TextContent>
          </Content>
        </Link>
        <GetCommunityMember
          userId={input.userId}
          communityId={input.communityId}
          render={({ communityMember }) => {
            if (!communityMember || !communityMember.isPending) return null;
            return (
              <ContentWash>
                <AttachmentsWash>
                  <ButtonsRow>
                    <MutationWrapper
                      mutation={blockPendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <OutlineButton loading={isLoading} glyph={'minus'}>
                          屏蔽
                        </OutlineButton>
                      )}
                    />
                    <MutationWrapper
                      mutation={approvePendingCommunityMember}
                      variables={{ input: input }}
                      render={({ isLoading }) => (
                        <Button loading={isLoading} glyph={'plus'}>
                          通过
                        </Button>
                      )}
                    />
                  </ButtonsRow>
                </AttachmentsWash>
              </ContentWash>
            );
          }}
        />
      </SegmentedNotificationListRow>
    );
  }
}

export const MiniPrivateCommunityRequestSent = compose(
  markSingleNotificationSeenMutation,
  approvePendingCommunityMember,
  // $FlowFixMe
  blockPendingCommunityMember
)(MiniPrivateCommunityRequestSentWithMutation);
