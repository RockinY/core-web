// @flow
import * as React from 'react';
import {
  SectionsContainer,
  Column,
} from '../../../components/settingsViews/style';
import EditForm from './editForm';
import PendingUsers from './pendingUsers';
import BlockedUsers from './blockedUsers';
import ChannelMembers from './channelMembers';
import ArchiveForm from './archiveForm';
import LoginTokenSettings from './joinTokenSettings';
import { ErrorBoundary, SettingsFallback } from '../../../components/error';

type Props = {
  community: Object,
  channel: Object,
  communitySlug: string,
  togglePending: Function,
  unblock: Function,
  initMessage: Function,
};
class Overview extends React.Component<Props> {
  render() {
    const { channel, initMessage } = this.props;

    return (
      <SectionsContainer data-cy="channel-overview">
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EditForm channel={channel} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.slug !== 'general' && <ArchiveForm channel={channel} />}
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {channel.isPrivate && (
              <LoginTokenSettings id={channel.id} channel={channel} />
            )}
          </ErrorBoundary>
        </Column>

        <Column>
          {channel.isPrivate && (
            <span>
              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <ChannelMembers
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <PendingUsers
                  togglePending={this.props.togglePending}
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <BlockedUsers
                  unblock={this.props.unblock}
                  channel={channel}
                  id={channel.id}
                  initMessage={initMessage}
                />
              </ErrorBoundary>
            </span>
          )}

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {!channel.isPrivate && <ChannelMembers id={channel.id} />}
          </ErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
