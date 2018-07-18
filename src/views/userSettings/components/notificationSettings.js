// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Checkbox } from '../../../components/formElements';
import WebPushManager from '../../../utils/webPushManager';
import { addToastWithTimeout } from '../../../actions/toasts';
import { subscribeToWebPush } from '../../../graphql/subscriptions';
import { ListContainer, Notice } from '../../../components/listItems/style';
import { SectionCard, SectionTitle } from '../../../components/settingsViews/style';
import { EmailListItem } from '../style';
import type { Dispatch } from 'redux';

type State = {
  webPushBlocked: boolean,
  subscription: ?any,
};

type Props = {
  subscribeToWebPush: Function,
  dispatch: Dispatch<Object>,
  smallOnly?: boolean,
  largeOnly?: boolean,
};

class NotificationSettings extends React.Component<Props, State> {
  state = {
    webPushBlocked: false,
    subscription: null,
  };

  componentDidMount() {
    WebPushManager.getPermissionState().then(result => {
      if (result === 'denied') {
        this.setState({
          webPushBlocked: true,
        });
      }
    });
    WebPushManager.getSubscription().then(subscription => {
      this.setState({
        subscription: subscription || false,
      });
    });
  }

  subscribeToWebPush = () => {
    WebPushManager.subscribe()
      .then(subscription => {
        this.setState({
          subscription,
          webPushBlocked: false,
        });
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        return this.props.dispatch(
          addToastWithTimeout(
            'error',
            "啊哦，通知开启失败了，请重新尝试!"
          )
        );
      });
  };

  unsubscribeFromWebPush = () => {
    WebPushManager.unsubscribe()
      .then(result => {
        if (result) {
          this.setState({
            subscription: false,
          });
        } else {
          return this.props.dispatch(
            addToastWithTimeout(
              'error',
              "啊哦，通知开启失败了，请重新尝试!"
            )
          );
        }
      })
      .catch(() => {
        return this.props.dispatch(
          addToastWithTimeout(
            'error',
            "啊哦，通知开启失败了，请重新尝试!"
          )
        );
      });
  };

  render() {
    const { webPushBlocked, subscription } = this.state;
    const onChange = !subscription
      ? this.subscribeToWebPush
      : this.unsubscribeFromWebPush;

    return (
      <SectionCard
        smallOnly={this.props.smallOnly}
        largeOnly={this.props.largeOnly}
      >
        <SectionTitle>通知设置</SectionTitle>
        <ListContainer>
          <EmailListItem>
            {subscription !== null && (
              <Checkbox
                checked={!!subscription}
                disabled={webPushBlocked}
                onChange={onChange}
              >
                开启桌面推送通知
              </Checkbox>
            )}
            {webPushBlocked && (
              <Notice>
                <strong>
                  你已经关闭这台设备的桌面通知
                </strong>{' '}
                重新开启桌面推送通知{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://support.sendpulse.com/456261-How-to-Unblock-Web-Push-Notifications"
                >
                  开启
                </a>.
              </Notice>
            )}
          </EmailListItem>
        </ListContainer>
      </SectionCard>
    );
  }
}

export default compose(subscribeToWebPush, connect())(NotificationSettings);
