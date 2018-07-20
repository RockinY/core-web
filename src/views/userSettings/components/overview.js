// @flow
import * as React from 'react';
import type { GetCurrentUserSettingsType } from '../../../graphql/queries/user/getCurrentUserSettings';
import UserEditForm from './editForm';
import EmailSettings from './emailSettings';
import NotificationSettings from './notificationSettings';
import { SectionsContainer, Column } from '../../../components/settingsViews/style';
import { ErrorBoundary, SettingsFallback } from '../../../components/error';
import { isDesktopApp } from '../../../utils/isDesktopApp';

type Props = {
  user: GetCurrentUserSettingsType,
};

class Overview extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <SectionsContainer>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <UserEditForm user={user} />
          </ErrorBoundary>

        </Column>
        <Column>
          <ErrorBoundary fallbackComponent={SettingsFallback}>
            <EmailSettings user={user} />
          </ErrorBoundary>

          <ErrorBoundary fallbackComponent={SettingsFallback}>
            {!isDesktopApp() &&
              'serviceWorker' in navigator &&
              'PushManager' in window && <NotificationSettings largeOnly />}
          </ErrorBoundary>
        </Column>
      </SectionsContainer>
    );
  }
}

export default Overview;
