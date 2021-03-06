// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from '../link';
import toggleChannelSubscriptionMutation from '../../graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from '../../graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from '../../actions/toasts';
import { Button, OutlineButton } from '../buttons';
import { Actions } from './style';
import type { Dispatch } from 'redux';

type Props = {
  isPending: boolean,
  community: Object,
  channel: Object,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class RequestToJoinChannel extends Component<Props, State> {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleRequest = () => {
    const { dispatch, channel } = this.props;
    const channelId = channel.id;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        this.setState({
          isLoading: false,
        });

        const { toggleChannelSubscription } = data;

        const { isPending } = toggleChannelSubscription.channelPermissions;

        if (isPending) {
        } else {
        }

        const str = isPending
          ? `请求加入 ${toggleChannelSubscription.name} 在 ${
              toggleChannelSubscription.community.name
            }!`
          : `取消加入请求 ${toggleChannelSubscription.name} 再 ${
              toggleChannelSubscription.community.name
            }.`;

        const type = isPending ? 'success' : 'neutral';
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
    const { isPending, community, channel } = this.props;
    const { isLoading } = this.state;

    return (
      <Actions>
        {isPending && (
          <OutlineButton
            large
            onClick={this.toggleRequest}
            icon="minus"
            loading={isLoading}
            data-cy="cancel-request-to-join-private-channel-button"
          >
            取消请求
          </OutlineButton>
        )}

        {isPending && (
          <Link to={`/${community.slug}`}>
            <Button large>返回 {community.name}</Button>
          </Link>
        )}

        {!isPending && (
          <Button
            large
            onClick={this.toggleRequest}
            icon="private-unlocked"
            loading={isLoading}
            data-cy="request-to-join-private-channel-button"
          >
            请求加入 {channel.name}
          </Button>
        )}
      </Actions>
    );
  }
}

// $FlowFixMe
export default compose(connect(), toggleChannelSubscriptionMutation)(
  RequestToJoinChannel
);
