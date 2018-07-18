// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import toggleChannelNotificationsMutation from '../../../graphql/mutations/channel/toggleChannelNotifications';
import type { ToggleChannelNotificationsType } from '../../../graphql/mutations/channel/toggleChannelNotifications';
import { Checkbox } from '../../../components/formElements';
import { addToastWithTimeout } from '../../../actions/toasts';
import { ListContainer } from '../../../components/listItems/style';

type Props = {
  value: boolean,
  channel: {
    id: string,
    name: string,
  },
  toggleChannelNotifications: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isReceiving: boolean,
};

class NotificationsTogglePure extends React.Component<Props, State> {
  state: {
    isReceiving: boolean,
  };

  constructor(props) {
    super(props);

    const isReceiving = props.value;
    this.state = {
      isReceiving,
    };
  }

  handleChange = () => {
    const { channel: { id } } = this.props;
    const { isReceiving } = this.state;
    this.setState({
      isReceiving: !isReceiving,
    });

    this.props
      .toggleChannelNotifications(id)
      .then(({ data }: ToggleChannelNotificationsType) => {
        const { toggleChannelNotifications } = data;
        const value =
          toggleChannelNotifications.channelPermissions.receiveNotifications;
        const type = value ? 'success' : 'neutral';
        const str = value
          ? '通知已被激活!'
          : '通知已经关闭.';
        this.props.dispatch(addToastWithTimeout(type, str));
        return;
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isReceiving } = this.state;
    const { channel } = this.props;

    return (
      <ListContainer>
        <Checkbox
          id="isPrivate"
          checked={isReceiving}
          onChange={this.handleChange}
          dataCy="notifications-checkbox"
        >
          如果有新的话题在 {channel.name} 发布，获取通知信息
        </Checkbox>
      </ListContainer>
    );
  }
}

export const NotificationsToggle = compose(
  // $FlowFixMe
  toggleChannelNotificationsMutation,
  connect()
)(NotificationsTogglePure);
export default NotificationsToggle;
