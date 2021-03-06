// @flow
import React from 'react';
import Link from '../../../components/link';
import compose from 'recompose/compose';
import { displayLoadingCard } from '../../../components/loading';
import getPendingUsersQuery from '../../../graphql/queries/channel/getChannelPendingUsers';
import type { GetChannelPendingUsersType } from '../../../graphql/queries/channel/getChannelPendingUsers';
import { PendingUserNotificationContainer, PendingUserCount } from './style';

type Props = {
  data: {
    channel: GetChannelPendingUsersType,
  },
};

class PendingUsersNotificationPure extends React.Component<Props> {
  render() {
    const { channel } = this.props.data;

    if (!channel || !channel.pendingUsers || channel.pendingUsers.length === 0)
      return null;

    return (
      <PendingUserNotificationContainer>
        <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
          <PendingUserCount>{channel.pendingUsers.length}</PendingUserCount>
          等待中成员
        </Link>
      </PendingUserNotificationContainer>
    );
  }
}

export const PendingUsersNotification = compose(
  getPendingUsersQuery,
  displayLoadingCard
)(PendingUsersNotificationPure);

export default PendingUsersNotification;
