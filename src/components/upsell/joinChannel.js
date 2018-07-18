// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation from '../../graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from '../../graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from '../../actions/toasts';
import type { Dispatch } from 'redux';
import {
  JoinChannelContainer,
  JoinChannelContent,
  JoinChannelTitle,
  JoinChannelSubtitle,
} from './style';
import { Button } from '../buttons';

type Props = {
  channel: Object,
  community: Object,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class JoinChannel extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleSubscription = () => {
    const { channel, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId: channel.id })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        const { toggleChannelSubscription } = data;

        this.setState({
          isLoading: false,
        });

        const {
          isMember,
          isPending,
        } = toggleChannelSubscription.channelPermissions;

        let str = '';
        if (isPending) {
          str = `请求加入 ${toggleChannelSubscription.name} 在 ${
            toggleChannelSubscription.name
          }`;
        }

        if (!isPending && isMember) {
          str = `加入了 ${toggleChannelSubscription.name} 在 ${
            toggleChannelSubscription.name
          }!`;
        }

        if (!isPending && !isMember) {
          str = `离开了频道 ${toggleChannelSubscription.name} 在 ${
            toggleChannelSubscription.name
          }.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isLoading } = this.state;
    const { channel, community } = this.props;
    return (
      <JoinChannelContainer>
        <JoinChannelContent>
          <JoinChannelTitle>
            加入了社区 {community.name} 的 {channel.name} 频道
          </JoinChannelTitle>
          <JoinChannelSubtitle>
            一旦你成功加入了频道，你就可以即刻进行回复
          </JoinChannelSubtitle>
        </JoinChannelContent>

        <Button
          loading={isLoading}
          onClick={this.toggleSubscription}
          icon="plus"
          dataCy="thread-join-channel-upsell-button"
        >
          加入
        </Button>
      </JoinChannelContainer>
    );
  }
}

// $FlowFixMe
export default compose(connect(), toggleChannelSubscriptionMutation)(
  JoinChannel
);
