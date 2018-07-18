// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import Link from '../../../components/link';
import Icon from '../../../components/icons';
import Dropdown from '../../../components/dropdown';
import { Loading } from '../../../components/loading';
import { NullState } from '../../../components/upsell';
import { TextButton } from '../../../components/buttons';
import { DropdownHeader, DropdownFooter } from '../style';
import { NotificationDropdownList } from '../../notifications/components/notificationDropdownList';

const NullNotifications = () => (
  <NullState
    bg="notification"
    heading={`通知是空的`}
    copy={`一切看起来都很顺利! 🎉`}
  />
);

const NotificationContainer = props => {
  const {
    rawNotifications,
    currentUser,
    history,
    loading,
    markSingleNotificationAsSeenInState,
  } = props;

  if (rawNotifications && rawNotifications.length > 0) {
    return (
      <NotificationDropdownList
        rawNotifications={rawNotifications}
        currentUser={currentUser}
        history={history}
        markSingleNotificationAsSeenInState={
          markSingleNotificationAsSeenInState
        }
      />
    );
  }

  if (loading) {
    return (
      <div style={{ margin: '32px 0' }}>
        <Loading />
      </div>
    );
  }

  return <NullNotifications />;
};

const NotificationDropdownPure = props => {
  const {
    rawNotifications,
    currentUser,
    history,
    markAllAsSeen,
    count,
    markSingleNotificationAsSeenInState,
    loading,
  } = props;

  return (
    <Dropdown style={{ width: '400px' }}>
      <DropdownHeader>
        <Link to={`/users/${currentUser.username}/settings`}>
          <Icon glyph="settings" />
        </Link>
        <TextButton
          color={count > 0 ? 'brand.alt' : 'text.alt'}
          onClick={markAllAsSeen}
        >
          标记所有为已读
        </TextButton>
      </DropdownHeader>

      <NotificationContainer
        {...props}
        loading={loading}
        markSingleNotificationAsSeenInState={
          markSingleNotificationAsSeenInState
        }
      />

      {rawNotifications &&
        rawNotifications.length > 0 && (
          <DropdownFooter>
            <TextButton
              color={'text.alt'}
              onClick={() => history.push('/notifications')}
            >
              查看所有
            </TextButton>
          </DropdownFooter>
        )}
    </Dropdown>
  );
};

export const NotificationDropdown = compose(withRouter)(
  NotificationDropdownPure
);
